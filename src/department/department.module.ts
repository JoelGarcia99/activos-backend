import { Module } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from './entities/department.entity';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';

const typeOrmFeatures = TypeOrmModule.forFeature([
  Department,
]);

@Module({
  controllers: [DepartmentController],
  providers: [
    DepartmentService,
    AuthService,
  ],
  imports: [
    typeOrmFeatures,
    AuthModule,
  ]
})
export class DepartmentModule { }
