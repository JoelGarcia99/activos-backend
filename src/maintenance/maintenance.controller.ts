import { Controller, Get, Post, Body, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
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
    @Param('id') id: string,
    @Query('page') page: number,
    @Query('limit') limit: number
  ) {
    return await this.maintenanceService.findByAsset(
      +id,
      +(page ?? 1),
      +(limit ?? 10)
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.maintenanceService.remove(+id);
  }

  /**
   * Gets all the available maintenances from the last one to the previous one
   */
  @Get()
  async findAll(@Query('page') page: number, @Query('limit') limit: number) {
    return await this.maintenanceService.findAll(
      +(page ?? 1),
      +(limit ?? 10)
    );
  }
}
