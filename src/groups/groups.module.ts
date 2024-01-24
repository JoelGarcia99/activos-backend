import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { Group } from './entities/group.entity';
import { Subgroup } from './entities/subgroup.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';

const typeOrmFeatures = TypeOrmModule.forFeature([
  Group,
  Subgroup,
]);

@Module({
  controllers: [GroupsController],
  providers: [
    GroupsService,
  ],
  imports: [
    AuthModule,
    typeOrmFeatures,
  ]
})
export class GroupsModule { }
