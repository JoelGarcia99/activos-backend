import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { schema as envSchema } from './environment/initialization';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth/auth.service';
import { AppService } from './app.service';
import { EnvValue } from './environment/variables';

export const typeOrmRootConfig = TypeOrmModule.forRoot({
  type: 'mysql',
  host: EnvValue.DB_HOST,
  port: +EnvValue.DB_PORT,
  username: EnvValue.DB_USER,
  password: EnvValue.DB_PASS,
  database: EnvValue.DB_NAME,
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
  providers: [
    AuthService,
    AppService,
  ],
})
export class AppModule { }
