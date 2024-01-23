import { ExecutionContext, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRandomValues } from 'crypto';
import { Roles } from 'src/auth/entities/roles.enum';
import { User } from 'src/auth/entities/user.entity';
import { JwtStrategyOutput } from 'src/jwt/strategy';
import { Repository } from 'typeorm';

// list of characters to be injected to the password
const characters = [
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  "abcdefghijklmnopqrstuvwxyz",
  "0123456789",
  "!@#.%,?&_-"
]

@Injectable()
export class SecurityUtil {

  constructor(
    @InjectRepository(User)
    private readonly authRepository: Repository<User>,
  ) { }

  /**
  * Generates an 8 length secure password
  */
  generatePassword(): string {
    const charactersPerGroup = 3;
    let password = '';

    const shuffledArray = [...characters];
    shuffledArray.sort(() => Math.random() - 0.5);

    for (let ch of shuffledArray) {

      const randomBytes = getRandomValues(new Uint8Array(ch.length));

      for (let i = 0; i < charactersPerGroup; i++) {
        password += ch[randomBytes[i] % ch.length];
      }
    }

    // suffling the password to increase entrophy 
    password = password.split('').sort(() => Math.random() - 0.5).join('');

    return password;
  }

  /**
   * It's used to authorize an specific role on the guards, it's invoked by the 
   * `canActivate` method of guards
   */
  async authorizeActivation(context: ExecutionContext, role: Roles) {

    const request = context.switchToHttp().getRequest();

    // extracting a valid session
    const guardOutput = request['user'] as JwtStrategyOutput;

    // checking if the user is an admin
    const user = await this.authRepository.findOne({
      where: {
        id: guardOutput.userId,
        isDeleted: false
      },
    });

    // The user will always exist so we don't have to make that condition here
    return user?.role === role;
  }
}
