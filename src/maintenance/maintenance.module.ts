import { Module } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { MaintenanceController } from './maintenance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Maintenance } from './entities/maintenance.entity';
import { Asset } from 'src/assets/entities/asset.entity';
import { Responsible } from 'src/responsible/entities/responsible.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [MaintenanceController],
  providers: [MaintenanceService],
  imports: [
    TypeOrmModule.forFeature([
      Maintenance, Asset, Responsible,
    ]),
    AuthModule,
  ]
})
export class MaintenanceModule { }
