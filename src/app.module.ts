import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth/auth.service';
import { AppService } from './app.service';
import { EnvValue } from './environment/variables';
import { GroupsModule } from './groups/groups.module';
import { DepartmentModule } from './department/department.module';
import { ResponsibleModule } from './responsible/responsible.module';
import { AssetsModule } from './assets/assets.module';
import { MaintenanceModule } from './maintenance/maintenance.module';

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
    typeOrmRootConfig,
    ThrottlerModule.forRoot([{
      // it stands for: allow up to 100 requests within a period of 60 seconds
      ttl: 60,
      limit: 100,
    }]),
    AuthModule,
    GroupsModule,
    DepartmentModule,
    ResponsibleModule,
    AssetsModule,
    MaintenanceModule,
  ],
  providers: [
    AppService,
    AuthService,
  ],
})
export class AppModule { }
