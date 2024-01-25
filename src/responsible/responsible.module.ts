import { Module } from '@nestjs/common';
import { ResponsibleService } from './responsible.service';
import { ResponsibleController } from './responsible.controller';
import { AuthModule } from 'src/auth/auth.module';
import { Responsible } from './entities/responsible.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

const typeOrmFeatures = TypeOrmModule.forFeature([
  Responsible,
]);

@Module({
  controllers: [ResponsibleController],
  providers: [ResponsibleService],
  imports: [
    typeOrmFeatures,
    AuthModule,
  ]
})
export class ResponsibleModule { }
