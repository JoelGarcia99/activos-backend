import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAssetDto } from './dto/create-asset.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Asset } from './entities/asset.entity';
import { IsNull, Repository } from 'typeorm';
import { DbOutputProcessor } from 'src/utils/processors/mysql.errors';
import * as fs from 'fs';
import { IMAGE_STORAGE_LOCATION, STORAGE_LOCATION } from 'src/utils/storage';
import { AssetImage } from './entities/asset-images.entity';
import { v4 as uuidv4 } from 'uuid';
import { ReadStream } from 'typeorm/platform/PlatformTools';

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>,
    @InjectRepository(AssetImage)
    private readonly assetImageRepository: Repository<AssetImage>,
  ) { }



  /**
  * Creates & link a new asset to an existing department, responsible user, and subgroup.
  * It'll raise a DB exception if any of those relations doesn't exist.
  *
  * @param {number} userId
  * The ID of the user which is in session and the one who created the current asset 
  *
  * @param {CreateAssetDto} createAssetDto
  * It doesn't make any validation over the file, that's the work of the controller, it 
  * just take and store them
  */
  async create(userId: number, createAssetDto: CreateAssetDto) {
    try {
      const newAsset = this.assetRepository.create({
        ...createAssetDto,
        creatorId: userId,
      });
      console.log(newAsset);
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
   */
  async uploadFiles(assetId: number, files: Array<Express.Multer.File>): Promise<AssetImage[]> {
    // creating the storage path if it doesn't exist 
    if (fs.existsSync(`${STORAGE_LOCATION}/${IMAGE_STORAGE_LOCATION}`) === false) {
      fs.mkdirSync(`${STORAGE_LOCATION}/${IMAGE_STORAGE_LOCATION}`, { recursive: true });
    }

    const filesEntities: AssetImage[] = [];

    for (const file of files) {
      // generating uuid for each file to avoid collisions 
      const fileName = uuidv4();
      const originalExtension = file.originalname.split('.').pop();

      // writing the file to the defined storage
      fs.writeFileSync(`${STORAGE_LOCATION}/${IMAGE_STORAGE_LOCATION}/${fileName}.${originalExtension}`, file.buffer);

      const newFile = this.assetImageRepository.create({
        url: `${IMAGE_STORAGE_LOCATION}/${fileName}.${originalExtension}`,
        assetId,
      });

      filesEntities.push(newFile);
    }

    return await this.assetImageRepository.save(filesEntities);
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


  /**
  *
  */
  async loadImage(path: string): Promise<ReadStream> {
    console.log(path);
    if (!fs.existsSync(`${STORAGE_LOCATION}/${IMAGE_STORAGE_LOCATION}/${path}`)) {
      throw new BadRequestException(['No se encontro el archivo']);
    }

    return fs.createReadStream(`${STORAGE_LOCATION}/${IMAGE_STORAGE_LOCATION}/${path}`);
  }

  /**
  * Fully removes an image from both DB and storage. If the image doesn't exist it'll
  * raise a 404 error
  */
  async deleteImage(imageId: number) {
    // looking for the image on the DB to see if it exists 
    const image = await this.assetImageRepository.findOne({
      where: {
        id: imageId,
      }
    });

    if (!image) {
      throw new NotFoundException(['No se encontro la imagen']);
    }

    // proceeding with the image deletion from DB 
    await this.assetImageRepository.delete(imageId);

    // deleting the image in background from storage
    fs.unlink(`${STORAGE_LOCATION}/${image.url}`, (err) => {
      if (err) {
        console.error(err);
      }
    });

    return {
      message: 'Imagen eliminada',
    };
  }

  /**
   *
   */
  async getAssetById(id: number) {
    return await this.assetRepository.findOne({
      where: {
        id,
        deletedAt: IsNull(),
      }
    });
  }
}
