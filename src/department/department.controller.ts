import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { DeletionDto } from 'src/groups/dto/delete.dto';
import { JwtStrategyOutput } from 'src/jwt/strategy';

@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) { }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async create(@Body() createDepartmentDto: CreateDepartmentDto) {
    return await this.departmentService.create(createDepartmentDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async list(
    @Query('page') page: number,
    @Query('limit') limit: number
  ) {
    return await this.departmentService.list(
      +(page ?? 1),
      +(limit ?? 10)
    );
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async update(
    @Param('id') id: string,
    @Body() updateDepartmentDto: CreateDepartmentDto
  ) {
    return await this.departmentService.update(+id, updateDepartmentDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async delete(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() deleteDepartmentDto: DeletionDto,
  ) {
    const { userId } = req['user'] as JwtStrategyOutput;

    return await this.departmentService.delete(
      +id,
      deleteDepartmentDto,
      +userId
    );
  }
}
