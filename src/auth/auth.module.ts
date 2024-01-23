import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { Session } from './entities/session.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from './guards/auth.guard';
import { TokensService } from 'src/jwt/service';
import { SecurityUtil } from 'src/utils/security';
import { JwtStrategy } from 'src/jwt/strategy';
import { EnvValue } from 'src/environment/variables';
import { MailUtil } from 'src/utils/mail';

const jwtRegistration = JwtModule.registerAsync({
  imports: [],
  useFactory: () => ({
    secret: EnvValue.ACCESS_TOKEN_PASS,
    signOptions: { expiresIn: EnvValue.JWT_EXPIRATION_TIME },
  }),
});

const typeOrmFeatures = TypeOrmModule.forFeature([
  User, Session,
]);

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    TokensService,
    JwtAuthGuard,
    MailUtil,
    JwtStrategy,
    SecurityUtil,
  ],
  imports: [
    typeOrmFeatures,
    Session,
    User,
    jwtRegistration,
  ],
  exports: [
    typeOrmFeatures,
    Session,
    SecurityUtil,
    TokensService,
    User,
    jwtRegistration,
    MailUtil,
  ]
})
export class AuthModule { }
