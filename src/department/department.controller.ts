import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { ResponseBuilder } from 'src/utils/response/builder';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { DeletionDto } from 'src/groups/dto/delete.dto';

@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) { }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async create(@Req() req: Request, @Body() createDepartmentDto: CreateDepartmentDto) {
    return await ResponseBuilder.build(
      req, async (_) => await this.departmentService.create(createDepartmentDto),
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async list(@Req() req: Request) {
    return await ResponseBuilder.build(
      req, async (_) => await this.departmentService.list(),
    );
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateDepartmentDto: CreateDepartmentDto
  ) {
    return await ResponseBuilder.build(
      req, async (_) => await this.departmentService.update(+id, updateDepartmentDto),
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async delete(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() deleteDepartmentDto: DeletionDto,
  ) {
    return await ResponseBuilder.build(
      req, async (userId) => await this.departmentService.delete(
        +id,
        deleteDepartmentDto,
        +userId
      ),
    );
  }
}
