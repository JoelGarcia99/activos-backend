import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { schema as envSchema } from './environment/initialization';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER } from './environment/variables';

export const typeOrmRootConfig = TypeOrmModule.forRoot({
  type: 'mysql',
  host: DB_HOST,
  port: +DB_PORT,
  username: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  autoLoadEntities: true,
});

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: envSchema,
    }),
    typeOrmRootConfig,
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
