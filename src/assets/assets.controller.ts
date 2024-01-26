import { Controller, Post, Body, UseGuards, Req, Get, Patch, Param, Delete, UseInterceptors, UploadedFile, PipeTransform } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { FileFastifyInterceptor } from 'fastify-file-interceptor';

// TODO:
type TParseFormDataJsonOptions = {
  field: string
}

export class ParseFormDataJsonPipe implements PipeTransform {
  constructor(private options?: TParseFormDataJsonOptions) { }

  transform(value: any) {
    console.log(value)
    const { field } = this.options
    const jsonField = value[field].replace(
      /(\w+:)|(\w+ :)/g,
      function(matchedStr: string) {
        return (
          '"' + matchedStr.substring(0, matchedStr.length - 1) + '":'
        )
      }
    )
    return JSON.parse(jsonField)
  }
}

@Controller('assets')
@UseGuards(JwtAuthGuard)
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) { }

  @Post()
  @UseInterceptors(FileFastifyInterceptor('file'))
  @UseGuards(AdminGuard)
  async create(
    @Req() req: any,
    @Body(
      new ParseFormDataJsonPipe({ field: 'body' })
    ) createAssetDto: CreateAssetDto
  ) {
    return "hola";
    // async (_) => await this.assetsService.create(createAssetDto),
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
