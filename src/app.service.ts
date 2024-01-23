import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './auth/entities/user.entity';
import { Repository } from 'typeorm';
import * as argon2 from '@node-rs/argon2';
import { randomBytes } from 'crypto';
import { Roles } from './auth/entities/roles.enum';
import { EnvValue } from './environment/variables';

@Injectable()
export class AppService {

  constructor(
    @InjectRepository(User)
    private readonly authRepository: Repository<User>,
  ) {

    console.warn("=============================================")
    console.warn("If you see it too often, please report it. 💀");
    console.warn("=============================================")

    console.warn("Verifying the existense of the root user...");
    this.authRepository.find({
      where: {
        role: "root",
      }
    }).then(async (output) => {
      if (output.length == 1) {
        console.warn("The root user already exists, bypassing. 🚀");
        return;
      }
      if (output.length > 1) {
        throw new Error("Too many root users, something is wrong. 💀");
      }

      console.log("Root user not found, creating a new one... ✨");
      const user = new User();
      user.name = "Root";
      user.email = "soporteerpzc@gmail.com"; // TODO: ask @Dario

      // NOTE: At this point 2024-22-01 it uses Argon2id algorithm for hashing.
      // Keep it in mind
      user.password = argon2.hashSync(
        "123Root.",
        {
          salt: randomBytes(EnvValue.SALT_LENGTH),
        }
      );
      user.role = Roles.ROOT;

      // saving the user 
      await this.authRepository.save(user);

      console.log("Root user created. Proceeding with API service.");
    });
  }
}
