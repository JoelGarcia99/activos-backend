import { Injectable, NestMiddleware } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, _: Response, next: NextFunction) {
    console.log(`${dayjs().format("YYYY-MM-DD HH:mm:ss")} | 🚀\tRoute requested: ${req.method} ${req.url}`);
    next();
  }
}
