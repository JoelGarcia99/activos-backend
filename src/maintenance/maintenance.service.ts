import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Maintenance } from './entities/maintenance.entity';
import { Repository } from 'typeorm';
import { Responsible } from 'src/responsible/entities/responsible.entity';
import { Asset } from 'src/assets/entities/asset.entity';
import { DbOutputProcessor } from 'src/utils/processors/mysql.errors';

@Injectable()
export class MaintenanceService {

  constructor(
    @InjectRepository(Maintenance)
    private readonly maintenanceRepository: Repository<Maintenance>,
    @InjectRepository(Responsible)
    private readonly responsibleRepository: Repository<Responsible>,
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>,
  ) { }

  /**
  * Creates a new maintenance and links it to an existing repsonsible user
  */
  async create(createMaintenanceDto: CreateMaintenanceDto) {
    // verifying the responsible user does exist 
    const dbResponsible = await this.responsibleRepository.findOne({
      where: {
        id: createMaintenanceDto.responsibleId,
        isDeleted: false
      }
    });

    if (!dbResponsible) {
      throw new NotFoundException(['El responsable no existe']);
    }

    // verifying the active does exist 
    const dbAsset = await this.assetRepository.findOne({
      where: {
        id: createMaintenanceDto.assetId,
      },
    });

    if (!dbAsset) {
      throw new NotFoundException(['El activo no existe']);
    }

    const createdMaintenance = this.maintenanceRepository.create(createMaintenanceDto);
    try {
      const savedMaintenance = await this.maintenanceRepository.save(createdMaintenance);
      return savedMaintenance;
    } catch (e) {
      throw new NotFoundException([DbOutputProcessor.processError(e, {
        entityName: 'Mantenimiento'
      })]);
    }
  }

  findAll() {
    return `This action returns all maintenance`;
  }

  findOne(id: number) {
    return `This action returns a #${id} maintenance`;
  }

  update(id: number, updateMaintenanceDto: UpdateMaintenanceDto) {
    return `This action updates a #${id} maintenance`;
  }

  remove(id: number) {
    return `This action removes a #${id} maintenance`;
  }
}
