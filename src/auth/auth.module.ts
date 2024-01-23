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

const jwtRegistration = JwtModule.registerAsync({
  imports: [],
  useFactory: () => ({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME },
  }),
});

const typeOrmFeatures = TypeOrmModule.forFeature([
  User, Session,
]);

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAuthGuard,
    TokensService,
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
  ]
})
export class AuthModule { }
