import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ResponsibleService } from './responsible.service';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { ResponseBuilder } from 'src/utils/response/builder';
import { CreateResponsibleDto } from './dto/create-responsible.dto';

@Controller('responsible')
export class ResponsibleController {
  constructor(private readonly responsibleService: ResponsibleService) { }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async create(@Req() req: Request, @Body() createResponsibleDto: CreateResponsibleDto) {
    return await ResponseBuilder.build(
      req, async (_) => await this.responsibleService.create(createResponsibleDto),
    );
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateResponsibleDto: CreateResponsibleDto
  ) {
    return await ResponseBuilder.build(
      req, async (_) => await this.responsibleService.update(+id, updateResponsibleDto),
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async list(@Req() req: Request) {
    return await ResponseBuilder.build(
      req, async (_) => await this.responsibleService.list(),
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async delete(
    @Req() req: Request,
    @Param('id') id: string
  ) {
    return await ResponseBuilder.build(
      req, async (_) => await this.responsibleService.delete(+id),
    );
  }
}
