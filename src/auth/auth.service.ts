import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Session } from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-user.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Session as AuthSession } from './entities/session.entity';
import { EntityManager, Repository } from 'typeorm';
import { Roles } from './entities/roles.enum';
import { LoginDto } from './dto/login.dto';
import { TokensService } from 'src/jwt/service';
import * as argon2 from '@node-rs/argon2';
import { randomBytes } from 'crypto';
import { CreateUserDto } from './dto/create-user.dto';
import { SecurityUtil } from 'src/utils/security';
import dayjs from 'dayjs';

@Injectable()
export class AuthService {

  public constructor(
    @InjectRepository(User)
    private readonly authRepository: Repository<User>,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<AuthSession>,
    private readonly tokensService: TokensService,
    private readonly securityUtil: SecurityUtil,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) { }

  /**
  * Loads all the registered admins on the DB
  */
  async loadAdmins() {
    const admins = await this.authRepository.find({
      where: {
        role: Roles.ADMIN,
        isDeleted: false,
      }
    });

    return admins;
  }

  async login(loginDto: LoginDto) {

    let accessToken: string;
    let finalUser: User;
    let isUsingInitialPassword: boolean;

    // executing an ACID transaction to rollback everything if any error is 
    // encountered
    try {
      // validating IP is a valid IP format
      const { email, password } = loginDto;

      // querying the user on DB
      const dbUser = await this.authRepository.findOne({
        where: {
          email,
        }
      });

      if (!dbUser) {
        throw new BadRequestException(['Las credenciales no son correctas']);
      }

      const isPasswordValid = argon2.verify(
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

      // creating the new AT
      accessToken = await this.tokensService.createAccessToken(session);
      finalUser = dbUser;

      // removing the password 
      delete finalUser.password;
    } catch (e) {
      // console.error(`${dayjs().format("DD/MM/YYYY HH:mm:ss")} | 💀\tError while logging: `, e);
      throw new BadRequestException([e?.detail ?? e?.response?.message[0] ?? "Petición fallida. Intente más tarde"]);
    }

    return {
      user: finalUser,
      isUsingInitialPassword,
      accessToken,
    };
  }

  /**
   * It just deletes the entire session so the access token can't find its associated 
   * refresh token anymore.
   */
  async logout(rtId: number) {

    await this.sessionRepository.delete({
      id: rtId,
    });

    return {
      message: [
        'Sesión cerrada exitosamente',
      ]
    }
  }

  // async sendRecoveryCode(email: string) {
  //
  //   const output = {
  //     message: [
  //       "Si el correo es correcto, un email con el código de recuperación será enviado",
  //     ]
  //   };
  //
  //   // searching if the email is part of our DB
  //   const user = await this.userRepository.findOne({
  //     where: {
  //       email: email.trim(),
  //     },
  //   });
  //
  //   // if it isn't don't send any email to save resources
  //   if (!user) {
  //     return output;
  //   }
  //
  //   // validating if the recovery code wasn't send in the last 5 minutes
  //   const lastRecovery = await this.recoveryRepository.find({
  //     where: {
  //       userId: user.id,
  //     },
  //     order: {
  //       createdAt: 'DESC',
  //     }
  //   });
  //
  //   if (lastRecovery.length > 0) {
  //     // checking expiration date
  //     const now = dayjs();
  //     const lastRecoveryDate = dayjs(lastRecovery[0].createdAt);
  //
  //     // if the last code is less than 5 minutes long don't send it
  //     if (now.diff(lastRecoveryDate, 'minutes') < 5) {
  //       return {
  //         message: [
  //           "Ya ha generado un código de recuperación. Intente más tarde",
  //         ]
  //       };
  //     }
  //
  //     // removing all the non used recovery codes
  //     await this.recoveryRepository.remove(lastRecovery);
  //   }
  //
  //   const recoveryCode = Math.floor(100000 + Math.random() * 900000).toString();
  //
  //   // NOTE: IT's ok to run it at background
  //   this.mailUtil.sendEmail({
  //     to: [
  //       {
  //         email: user.email,
  //         name: user.name,
  //       }
  //     ],
  //     subject: 'Recuperación de contraseña',
  //     textPart: "Su código de recuperación ha sido generado",
  //     htmlPart: `Su código de recuperación es: ${recoveryCode}`,
  //     customID: 'recovery-code',
  //   });
  //
  //   // NOTE: If any error is encountered on the post method then this point is 
  //   // never reached so it's ok to proceed without any explicit validation
  //   await this.recoveryRepository.save({
  //     recoveryCode,
  //     userId: user.id,
  //   });
  //
  //   return output;
  // }

  // async changePassword(body: ChangePasswordDto) {
  //   // looking for the generated code on DB
  //   const recovery = await this.recoveryRepository.findOne({
  //     where: {
  //       recoveryCode: body.recoveryCode,
  //     },
  //   });
  //
  //   if (!recovery || recovery.recoveryCode !== body.recoveryCode) {
  //     throw new BadRequestException(['El código de recuperación no es válido']);
  //   }
  //
  //   const createdAt = dayjs(recovery.createdAt)
  //
  //   if (dayjs(createdAt) < dayjs().subtract(5, 'minutes')) {
  //     throw new BadRequestException(['El código de recuperación ha expirado']);
  //   }
  //
  //   // extracting the user id
  //   const user = await this.userRepository.findOne({
  //     where: {
  //       id: recovery.userId,
  //     },
  //   });
  //
  //   // hashing the password
  //   const { newPassword } = body;
  //   const hashedPassword = bcrypt.hashSync(
  //     newPassword,
  //     environment.hashSalts,
  //   );
  //
  //   await this.userRepository.save({
  //     ...user,
  //     password: hashedPassword,
  //   });
  //
  //   await this.recoveryRepository.remove(recovery);
  //
  //   return {
  //     message: [
  //       'Contraseña restablecida exitosamente',
  //     ],
  //   }
  // }


  /**
   * Creates a new user
   */
  async register(createUserDto: CreateUserDto) {

    let finalUser: User;

    // generating a random password to be used by the target user and delivery via email
    const generatedPassword = this.securityUtil.generatePassword();

    // executing an ACID transaction to rollback everything if any error is
    // encountered
    try {
      await this.entityManager.transaction(async (em) => {

        if (createUserDto.role === 'root') {
          throw new ForbiddenException(['El rol no puede ser root']);
        }

        const password = argon2.hashSync(
          generatedPassword,
          {
            salt: randomBytes(10)
          }
        );

        const user = await this.authRepository.save({
          ...createUserDto,
          password,
          initialPassword: password,
        });

        // saving the user
        const dbUser = await em.save<User>(user);
        finalUser = dbUser;

        // removing the password
        delete finalUser.password;
      });
    } catch (e) {
      console.error(`${dayjs().format("DD/MM/YYYY HH:mm:ss")} | 💀\tError while registering user: `, e);
      throw new BadRequestException([e?.detail ?? "Petición fallida. Intente más tarde"]);
    }

    // await this.mailUtil.sendEmail({
    //   to: [
    //     {
    //       email: finalUser.email,
    //       name: finalUser.name,
    //     },
    //   ],
    //   subject: "Cuenta Hermes creada con éxito",
    //   textPart: "Sus credenciales de Hermes han sido generadas",
    //   htmlPart: "<h2>Guarde sus credenciales en un lugar seguro</h2>" +
    //     "<br><span>Usuario: " + finalUser.username + "</span>" +
    //     "<br><span>Contraseña: " + generatedPassword + "</span>" +
    //     "<br><span>Rol: " + finalUser.role + "</span>" +
    //     "<br><br><b>Recuerde que debe cambiar la contraseña al iniciar sesión</b>",
    //   customID: "account-creation-" + finalUser.id,
    // });

    return {
      user: finalUser,
      message: [
        "Las credenciales han sido enviadas al email del usuario"
      ],
    };
  }

  /**
   * Checks the status of an user's session. It'll return an unauthorized 
   * exception if the token is experid or the user object if it's valid
   */
  async checkStatus(userId: number) {
    return await this.authRepository.findOne({
      where: {
        id: userId,
      },
    });
  }


  /**
  * Updates an user and/or his password. It's not allowed to update the role, you must 
  * call the proper service if you want to update the role
  */
  async updateUser(userId: number, updateUserDto: UpdateAuthDto) {

    delete updateUserDto.role;

    const user = await this.authRepository.findOne({
      select: {
        id: true,
        password: true,
      },
      where: {
        id: userId,
        isDeleted: false,
      },
    });

    if (!user) {
      throw new NotFoundException(['El usuario no existe o está inactivo']);
    }

    // the role cannot be changed
    delete updateUserDto.role;

    // if the password is present then continue with the flow to update it
    if (updateUserDto.password) {

      // verifying if the old password matches the current one 
      if (!argon2.verifySync(user.password, updateUserDto.oldPassword)) {
        throw new BadRequestException(['La contraseña actual no es válida']);
      }

      // hashing the new password
      user.password = argon2.hashSync(
        updateUserDto.password,
        {
          // random salt 
          salt: randomBytes(10),
        }
      );

      updateUserDto.password = user.password;
    }

    // deleting the old password entry since it doesn't exist on DB
    delete updateUserDto.oldPassword;

    await this.authRepository.update(userId, {
      ...updateUserDto
    });

    return {
      message: "Usuario actualizado correctamente"
    };
  }

}
