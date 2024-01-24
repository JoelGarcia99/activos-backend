import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Session } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Session as AuthSession } from './entities/session.entity';
import { EntityManager, Not, Repository } from 'typeorm';
import { Roles } from './entities/roles.enum';
import { LoginDto } from './dto/login.dto';
import { TokensService } from 'src/jwt/service';
import * as argon2 from '@node-rs/argon2';
import { randomBytes } from 'crypto';
import { CreateUserDto } from './dto/create-user.dto';
import { SecurityUtil } from 'src/utils/security';
import * as dayjs from 'dayjs';
import { EnvValue } from 'src/environment/variables';
import { DbOutputProcessor } from 'src/utils/processors/mysql.errors';
import { MailUtil } from 'src/utils/mail';
import { JwtStrategyOutput } from 'src/jwt/strategy';
import { Recovery } from './entities/recovery.entity';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class AuthService {

  public constructor(
    @InjectRepository(User)
    private readonly authRepository: Repository<User>,
    @InjectRepository(AuthSession)
    private readonly sessionRepository: Repository<AuthSession>,
    @InjectRepository(Recovery)
    private readonly recoveryRepository: Repository<Recovery>,
    private readonly tokensService: TokensService,
    private readonly securityUtil: SecurityUtil,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly mailUtil: MailUtil,
  ) { }

  /**
  * Loads all the registered admins on the DB
  */
  async loadUsers() {
    const admins = await this.authRepository.find({
      where: {
        role: Not(Roles.ROOT)
      }
    });

    return admins.map((admin) => {
      delete admin.password;
      return admin;
    });
  }

  /**
   * Login for all the user roles. It'll generate a new session and stored in on the DB 
   * and will return the issued access token to the user.
   *
   * @param {LoginDto} loginDto
   */
  async login(loginDto: LoginDto) {

    const { email, password } = loginDto;

    // querying the user on DB
    const dbUser = await this.authRepository.findOne({
      where: {
        email,
        isDeleted: false
      }
    });

    if (!dbUser) {
      throw new BadRequestException(['Las credenciales no son correctas']);
    }

    const isPasswordValid = argon2.verifySync(
      dbUser.password,
      password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException(['Las credenciales no son correctas']);
    }

    // generating the refresh token
    const refreshToken = await this.tokensService.createRefreshToken(
      dbUser.id,
    );

    // removing all older sessions 
    await this.sessionRepository.delete({
      userId: dbUser.id,
    });

    // saving the refresh token into DB
    const newSession = this.sessionRepository.create({
      userId: dbUser.id,
      refreshToken,
    });

    // creating the new session with a new rotation refresh token
    const session: AuthSession = await this.sessionRepository.save(newSession);

    // creating the new AT and linking it to an existing rerfresh token. The lifetime of
    // the whole session deppends on both, the integrity of the access token as well as 
    // the data stored on the sesion table
    let accessToken = await this.tokensService.createAccessToken(session);

    // removing the password 
    delete dbUser.password;

    return {
      user: dbUser,
      accessToken,
    };
  }


  /**
   * Creates a new user [ADMIN, USER] only.
   */
  async register(createUserDto: CreateUserDto) {

    let finalUser: User;

    // generating a random password to be used by the target user and delivery via email
    const generatedPassword = this.securityUtil.generatePassword();

    // executing an ACID transaction to rollback everything if any error is
    // encountered
    try {
      await this.entityManager.transaction(async (em) => {

        const password = argon2.hashSync(
          generatedPassword,
          {
            salt: randomBytes(EnvValue.SALT_LENGTH)
          }
        );

        const user = this.authRepository.create({
          ...createUserDto,
          password,
        });

        // saving the user
        const dbUser = await em.save<User>(user);
        finalUser = dbUser;

        // removing the password
        delete finalUser.password;
      });
    } catch (e) {
      console.error(`${dayjs().format("DD/MM/YYYY HH:mm:ss")} | 💀\tError while registering user: `, e);
      throw new BadRequestException([
        DbOutputProcessor.processError(e, { entityName: 'Usuario' })
      ]);
    }

    // mailing 
    await this.mailUtil.sendAccountCreationEmail({
      to: finalUser.email,
      data: {
        password: generatedPassword,
        role: createUserDto.role,
      }
    });

    return {
      user: finalUser,
      message: [
        "Usuario creado correctamente, las credenciales han sido enviadas por correo"
      ],
    };
  }

  /**
  * Updates an user and/or his password. It's not allowed to update the role, you must 
  * call the proper service if you want to update the role
  */
  async updateUser(guardOutput: JwtStrategyOutput, updateUserDto: UpdateUserDto) {

    // extracting the user ID from the session
    const { userId } = guardOutput;

    console.log(Number(!!updateUserDto.oldPassword) + Number(!!updateUserDto.password))
    if (Number(!!updateUserDto.oldPassword) + Number(!!updateUserDto.password) === 1) {
      throw new BadRequestException(["Para actualizar contraseña debe proporcionar la antigua y la nueva"])
    }

    // looking for the already registered user in the DB so I can remove the old
    // profile image if needed
    const dbUser = await this.authRepository.findOne({
      where: { id: userId, isDeleted: false },
    });

    if (!dbUser) {
      throw new NotFoundException('Usuario no existe');
    }

    // deleting non needed fields
    const user = { ...updateUserDto }

    let newHashedPassword: string | undefined = undefined;

    if (updateUserDto.oldPassword) {
      // verifying if the old password matches the user password 
      const isMatch = argon2.verifySync(dbUser.password, updateUserDto.oldPassword);

      if (!isMatch) {
        throw new BadRequestException(["Las contraseñas no coinciden"])
      }

      newHashedPassword = argon2.hashSync(updateUserDto.password, {
        salt: randomBytes(EnvValue.SALT_LENGTH)
      });
    }

    try {
      await this.authRepository.save(
        {
          id: userId,
          ...user,
          password: newHashedPassword,
          updatedAt: new Date(),
        }
      );

    } catch (e) {
      if (e.code === '23505' && e.detail.includes('email')) {
        throw new BadRequestException({
          error: 'El correo ya existe',
          detail: e.detail,
        });
      }

      if (e.code === '23505' && e.detail.includes('cellphone')) {
        throw new BadRequestException({
          error: 'El celular ya existe',
          detail: e.detail,
        });
      }

      throw e;
    }

    delete dbUser.password;
    delete user.password;

    return {
      ...dbUser,
      ...user,
    }
  }

  /***
   * Checks if the user password matches the one in the DB
   */
  async checkPassword(
    userId: number,
    password: string,
    user: User | null
  ): Promise<boolean> {
    let dbUser = user ?? await this.authRepository.findOne({
      where: { id: userId, isDeleted: false },
    });

    if (!dbUser) {
      return false;
    }

    const isMatch = argon2.verifySync(dbUser.password, password);
    return isMatch;
  }


  /**
  *
  * Checks if an user has a valid & active session
  */
  async checkSession(guardOutput: JwtStrategyOutput) {

    // If the request flow reaches this point then it means the guard 
    // was able to refresh/validate the AT against the RT so everything
    // is ok so far
    const userId = guardOutput.userId;

    const user = await this.authRepository.findOne({
      where: { id: userId, isDeleted: false },
    });

    if (!user) {
      throw new NotFoundException("Sesión no válida");
    }

    delete user.password;

    return {
      user,
      accessToken: guardOutput.accessToken,
    };
  }

  /**
   * Removes the session record on the DB so the issued access token gets invalidated
   *
   */
  async logout(guardOutput: JwtStrategyOutput) {

    const { rtId } = guardOutput;

    // revoking all the active sessions of the [userId] for the target [deviceId]
    await this.sessionRepository.delete({
      id: rtId,
    });

    return {
      accessToken: null,
    };
  }


  /**
   * Sends a recovery code to the email of the provided [email]. It's necessary in order 
   * to being able to reset the password. It uses obscure response so it always return 
   * the same no matter the error or success.
   */
  async sendRecoveryCode(email: string) {

    const output = {
      message: [
        `Si el correo ${email} existe recivirá un código de recuperación`,
      ]
    };

    // searching if the email is part of our DB
    const user = await this.authRepository.findOne({
      where: {
        email: email.trim(),
      },
    });

    // if it isn't don't send any email to save resources
    if (!user) {
      console.log("No user found");
      return output;
    }

    console.log("Recovering password for the user: ", user);

    // validating if the recovery code wasn't send in the last 5 minutes
    const lastRecovery = await this.recoveryRepository.find({
      where: {
        userId: user.id,
      },
      order: {
        createdAt: 'DESC',
      }
    });

    if (lastRecovery.length > 0) {
      // checking expiration date
      const now = dayjs();
      const lastRecoveryDate = dayjs(lastRecovery[0].createdAt);

      // if the last code is less than 5 minutes long don't send it
      if (now.diff(lastRecoveryDate, 'minutes') < 5) {
        return {
          message: [
            "Ya ha generado un código de recuperación. Intente más tarde",
          ]
        };
      }

      // removing all the non used recovery codes
      await this.recoveryRepository.remove(lastRecovery);
    }

    const recoveryCode = Math.floor(100000 + Math.random() * 900000).toString();

    // NOTE: IT's ok to run it at background
    await this.mailUtil.sendRecoveryCode({
      to: user.email,
      data: {
        user: user.name,
        recovery_code: recoveryCode
      }
    });

    // NOTE: If any error is encountered on the post method then this point is 
    // never reached so it's ok to proceed without any explicit validation
    await this.recoveryRepository.save({
      recoveryCode,
      userId: user.id,
    });

    return output;
  }

  /**
  * Changes the password based on the recovery code sent to the user email.
  */
  async changePassword(body: ChangePasswordDto) {
    // looking for the generated code on DB
    const recovery = await this.recoveryRepository.findOne({
      where: {
        recoveryCode: body.recoveryCode,
      },
    });

    if (!recovery || recovery.recoveryCode !== body.recoveryCode) {
      throw new BadRequestException(['El código de recuperación no es válido']);
    }

    const createdAt = dayjs(recovery.createdAt)

    if (dayjs(createdAt) < dayjs().subtract(5, 'minutes')) {
      throw new BadRequestException(['El código de recuperación ha expirado']);
    }

    // extracting the user id
    const user = await this.authRepository.findOne({
      where: {
        id: recovery.userId,
      },
    });

    // hashing the password
    const { newPassword } = body;
    const hashedPassword = argon2.hashSync(
      newPassword,
      {
        salt: randomBytes(EnvValue.SALT_LENGTH),
      }
    );

    await this.authRepository.save({
      ...user,
      password: hashedPassword,
    });

    await this.recoveryRepository.remove(recovery);

    return {
      message: [
        'Contraseña restablecida exitosamente',
      ],
    }
  }

  /**
  * Deactivas an user account [soft delete]
  */
  async deactivateUser(email: string) {
    // searching the target user
    const user = await this.authRepository.findOne({
      where: {
        email: email.trim().toLowerCase(),
      },
    });

    if (!user) {
      throw new NotFoundException('El usuario a desactivar no existe');
    }

    const targetRoles = user.role;

    // if target role is a root then abort the mission
    if (targetRoles === Roles.ROOT) {
      throw new ForbiddenException(["El usuario ROOT no puede ser eliminado"]);
    }

    // proceeding with the deactiviation
    await this.authRepository.update(user.id, {
      isDeleted: true,
    });

    return {
      messages: [
        "Usuario desactivado exitosamente"
      ]
    }
  }

  /**
  * Activates an user account if it exists
  */
  async activateUser(email: string) {
    // searching the target user
    const user = await this.authRepository.findOne({
      where: {
        email: email.trim().toLowerCase(),
      },
    });

    if (!user) {
      throw new NotFoundException('El usuario a reactivar no existe');
    }

    // proceeding with the deactiviation
    await this.authRepository.update(user.id, {
      isDeleted: false,
    });

    return {
      messages: [
        "Usuario activado exitosamente"
      ]
    }
  }
}
