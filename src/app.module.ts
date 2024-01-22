import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { schema as envSchema } from './environment/initialization';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: envSchema,
    }),
    ThrottlerModule.forRoot([{
      // it stands for: allow up to 100 requests within a period of 60 seconds
      ttl: 60,
      limit: 100,
    }]),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
