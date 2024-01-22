import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/auth/entities/user.entity";
import { JwtStrategyOutput } from "src/jwt/strategy";
import { Repository } from "typeorm";
import { Roles } from "../entities/roles.enum";

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(
    @InjectRepository(User)
    private readonly authRepository: Repository<User>,
  ) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // extracting a valid session
    const guardOutput = request['user'] as JwtStrategyOutput;

    // checking if the user is an admin
    const user = await this.authRepository.findOne({
      where: {
        id: guardOutput.userId,
      },
    })

    // The user will always exist so we don't have to make that condition here
    return user?.role === Roles.ADMIN;
  }

}
