import { Controller, Post, Body, UseGuards, Req, Get, Patch, Param, Delete, PipeTransform, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { FileFastifyInterceptor } from 'fastify-file-interceptor';

@Controller('assets')
@UseGuards(JwtAuthGuard)
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) { }

  @Post()
  @UseGuards(AdminGuard)
  @UseInterceptors(FileFastifyInterceptor('file'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createAssetDto: CreateAssetDto
  ) {
    return await this.assetsService.create(createAssetDto);
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
