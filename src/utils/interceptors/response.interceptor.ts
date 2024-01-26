import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtStrategyOutput } from 'src/jwt/strategy';

@Injectable()
export class TokenInterceptor implements NestInterceptor {

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const jwtStrategy = request['user'] as (JwtStrategyOutput | undefined);

    if (!jwtStrategy) {
      return next.handle();
    }

    // Use the HttpService to get the access token from your authentication service
    return next.handle().pipe(
      map((data) => {
        return {
          data,
          accessToken: jwtStrategy.accessToken
        }
      })
    );
  }
}

