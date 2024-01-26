import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ResponsibleService } from './responsible.service';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { CreateResponsibleDto } from './dto/create-responsible.dto';

@Controller('responsible')
@UseGuards(JwtAuthGuard)
export class ResponsibleController {
  constructor(private readonly responsibleService: ResponsibleService) { }

  @Post()
  @UseGuards(AdminGuard)
  async create(@Body() createResponsibleDto: CreateResponsibleDto) {
    return await this.responsibleService.create(createResponsibleDto);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  async update(
    @Param('id') id: string,
    @Body() updateResponsibleDto: CreateResponsibleDto
  ) {
    return await this.responsibleService.update(+id, updateResponsibleDto);
  }

  @Get('/')
  async list() {
    return await this.responsibleService.list();
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async delete(
    @Param('id') id: string
  ) {
    return await this.responsibleService.delete(+id);
  }
}

