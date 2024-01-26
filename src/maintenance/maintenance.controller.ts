import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@Controller('maintenance')
@UseGuards(JwtAuthGuard)
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) { }

  @Post()
  @UseGuards(AdminGuard)
  async create(@Body() createMaintenanceDto: CreateMaintenanceDto) {
    return await this.maintenanceService.create(createMaintenanceDto);
  }

  @Get('/asset/:id')
  async findByAsset(
    @Param('id') id: string
  ) {
    return await this.maintenanceService.findByAsset(+id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.maintenanceService.remove(+id);
  }
}