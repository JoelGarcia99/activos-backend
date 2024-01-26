import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAssetDto } from './dto/create-asset.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Asset } from './entities/asset.entity';
import { IsNull, Repository } from 'typeorm';
import { DbOutputProcessor } from 'src/utils/processors/mysql.errors';
import { when } from 'joi';

@Injectable()
export class AssetsService {

  constructor(
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>,
  ) { }



  /**
  * Creates & link a new asset to an existing department, responsible user, and subgroup.
  * It'll raise a DB exception if any of those relations doesn't exist.
  *
  */
  async create(createAssetDto: CreateAssetDto) {
    try {
      const newAsset = this.assetRepository.create(createAssetDto);
      return await this.assetRepository.save(newAsset);
    } catch (error) {
      console.error(error);
      throw new BadRequestException([
        DbOutputProcessor.processError(error, {
          entityName: 'Activo',
        }),
      ]);
    }
  }

  /**
   *
   *
   */
  async list() {
    return await this.assetRepository.find({
      where: {
        deletedAt: IsNull(),
      }
    });
  }

  /**
   *
   */
  async update(id: number, updateAssetDto: CreateAssetDto) {
    try {
      await this.assetRepository.update({
        id,
        deletedAt: IsNull(),
      }, updateAssetDto);
      return {
        message: 'Activo actualizado',
      }
    } catch (e) {
      console.error(e);
      throw new BadRequestException([
        DbOutputProcessor.processError(e, {
          entityName: 'Activo',
        }),
      ]);
    }
  }

  /**
   *
   *
   */
  async delete(id: number) {
    try {
      await this.assetRepository.update({ id }, { deletedAt: new Date() });
      return {
        message: 'Activo eliminado',
      }
    } catch (e) {
      console.error(e);
      throw new BadRequestException([
        DbOutputProcessor.processError(e, {
          entityName: 'Activo',
        }),
      ]);
    }
  }
}
