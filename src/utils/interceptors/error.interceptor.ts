import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { JwtStrategyOutput } from 'src/jwt/strategy';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const jwtStrategy = request['user'] as (JwtStrategyOutput | undefined);

    if (!jwtStrategy || !jwtStrategy.accessToken) {
      return next.handle();
    }

    // Use the HttpService to get the access token from your authentication service
    return next.handle().pipe(
      catchError((err) => {
        return throwError(() => new HttpException({
          error: err.response,
          accessToken: jwtStrategy.accessToken
        }, err.status));
      })
    );
  }
}

