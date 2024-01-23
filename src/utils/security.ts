import { Injectable } from '@nestjs/common';
import { getRandomValues } from 'crypto';

// list of characters to be injected to the password
const characters = [
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  "abcdefghijklmnopqrstuvwxyz",
  "0123456789",
  "!@#.%,?&_-"
]

@Injectable()
export class SecurityUtil {

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

    return password;
  }
}
