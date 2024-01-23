import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
  * Validates a JWT to be valid and tries to renew it if needed
  */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

  handleRequest(err: any, straOutput: any, info: Error) {

    if (info || !straOutput) {
      throw new UnauthorizedException(info?.message ?? 'Unauthorized');
    }

    if (err) {
      console.error("err", err);
      throw err;
    }

    console.log(straOutput);
    return straOutput;
  }
}
