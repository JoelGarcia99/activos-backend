import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Roles } from "../entities/roles.enum";
import { SecurityUtil } from "src/utils/security";

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(
    private readonly securityUtils: SecurityUtil,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    return await this.securityUtils.authorizeActivation(context, Roles.ADMIN);
  }
}
