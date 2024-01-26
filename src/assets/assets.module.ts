import { Module } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { AssetsController } from './assets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from './entities/asset.entity';
import { AuthModule } from 'src/auth/auth.module';

const typeOrmSettings = TypeOrmModule.forFeature([
  Asset,
])

@Module({
  controllers: [AssetsController],
  providers: [AssetsService],
  imports: [
    typeOrmSettings,
    AuthModule,
  ]
})
export class AssetsModule { }
