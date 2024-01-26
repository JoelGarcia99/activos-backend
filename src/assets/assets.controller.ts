import { Controller, Post, Body, UseGuards, Req, Get, Patch, Param, Delete, PipeTransform, UploadedFile, UseInterceptors, BadRequestException, UploadedFiles } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { FileFastifyInterceptor, FilesFastifyInterceptor } from 'fastify-file-interceptor';

@Controller('assets')
@UseGuards(JwtAuthGuard)
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) { }

  @Post()
  @UseGuards(AdminGuard)
  @UseInterceptors(FilesFastifyInterceptor('images', null, {
    fileFilter: (_, file: Express.Multer.File, callback) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
        return callback(new BadRequestException([
          'Solo imagenes JPG, JPEG, PNG, GIF o WEBP son permitidas',
        ]));
      }
      callback(null, true);
    }
  }))
  async create(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() createAssetDto: CreateAssetDto
  ) {
    // only 5 files are allowed 
    if (files.length > 5) {
      throw new BadRequestException(['No se pueden subir mas de 5 archivos']);
    }

    const createdAsset = await this.assetsService.create(createAssetDto);

    // uploading files and linking it to the created asset
    await this.assetsService.uploadFiles(createdAsset.id, files);

    return {
      asset: createdAsset,
      files: files.length
    }
  }

  @Get()
  async list() {
    return await this.assetsService.list();
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  async update(
    @Body() updateAssetDto: CreateAssetDto,
    @Param('id') id: string
  ) {
    return await this.assetsService.update(+id, updateAssetDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async delete(
    @Param('id') id: string
  ) {
    return await this.assetsService.delete(+id);
  }
}
