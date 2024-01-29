import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  BadRequestException,
  UploadedFiles,
  Res,
  NotFoundException,
  Req,
  Query
} from '@nestjs/common';
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { FilesFastifyInterceptor } from 'fastify-file-interceptor';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { JwtStrategyOutput } from 'src/jwt/strategy';

@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) { }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @UseInterceptors(FilesFastifyInterceptor('images', null, {
    fileFilter: (_, file: Express.Multer.File, callback) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
        return callback(new BadRequestException([
          'Solo imagenes JPG, JPEG, PNG, GIF o WEBP son permitidas',
        ]));
      }

      // max file size is 5 MB 
      if (file.size > 5 * 1024 * 1024) {
        return callback(new BadRequestException(['El archivo es demasiado grande']));
      }
      callback(null, true);
    }
  }))
  async create(
    @Req() req: Request,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() createAssetDto: CreateAssetDto
  ) {
    // only 5 files are allowed 
    if (files.length > 5) {
      throw new BadRequestException(['No se pueden subir mas de 5 archivos']);
    }

    const { userId } = req['user'] as JwtStrategyOutput;

    const createdAsset = await this.assetsService.create(userId, createAssetDto);

    // uploading files and linking it to the created asset
    const uplaodedFiles = await this.assetsService.uploadFiles(createdAsset.id, files);
    createdAsset.images = uplaodedFiles;

    return createdAsset;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async list(
    @Query('page') page: number,
    @Query('limit') limit: number
  ) {
    return await this.assetsService.list(
      +(page ?? 1),
      +(limit ?? 10)
    );
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async update(
    @Body() updateAssetDto: UpdateAssetDto,
    @Param('id') id: string
  ) {
    return await this.assetsService.update(+id, updateAssetDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async delete(
    @Param('id') id: string
  ) {
    return await this.assetsService.delete(+id);
  }

  @Get('images/:path')
  async loadImage(
    @Res() res: any,
    @Param('path') path: string
  ) {
    const file = await this.assetsService.loadImage(path);

    if (!file) {
      throw new NotFoundException(['No se encontro el archivo']);
    }

    res.type(`image/${path.split('.').pop()}`).send(file);
  }

  @Delete('images/:imageId')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async deleteImage(
    @Param('imageId') imageId: string
  ) {
    return await this.assetsService.deleteImage(+imageId);
  }

  @Post('add-image/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @UseInterceptors(FilesFastifyInterceptor('images', null, {
    fileFilter: (_, file: Express.Multer.File, callback) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
        return callback(new BadRequestException([
          'Solo imagenes JPG, JPEG, PNG, GIF o WEBP son permitidas',
        ]));
      }

      // max file size is 5 MB 
      if (file.size > 5 * 1024 * 1024) {
        return callback(new BadRequestException(['El archivo es demasiado grande']));
      }
      callback(null, true);
    }
  }))
  async addImage(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Param('id') id: string
  ) {
    const asset = await this.assetsService.getAssetById(+id);

    if (!asset) {
      throw new NotFoundException(['No se encontro el activo']);
    }

    // validating the asset could have up to five files 
    if (asset.images.length + files.length > 5) {
      throw new BadRequestException(['El activo no puede tener más de 5 imagenes']);
    }

    await this.assetsService.uploadFiles(+id, files);

    return {
      message: 'Imagenes agregadas',
    }
  }
}
