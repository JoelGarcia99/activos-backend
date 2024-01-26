import { Module } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { AssetsController } from './assets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from './entities/asset.entity';
import { AuthModule } from 'src/auth/auth.module';
import { AssetImage } from './entities/asset-images.entity';

const typeOrmSettings = TypeOrmModule.forFeature([
  Asset, AssetImage,
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
