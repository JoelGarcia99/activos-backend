import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateGroupDto } from 'src/groups/dto/create-group.dto';
import { Responsible } from './entities/responsible.entity';
import { Repository } from 'typeorm';
import { CreateResponsibleDto } from './dto/create-responsible.dto';
import { DbOutputProcessor } from 'src/utils/processors/mysql.errors';

@Injectable()
export class ResponsibleService {
  constructor(
    @InjectRepository(Responsible)
    private readonly responsibleRepository: Repository<Responsible>,
  ) { }

  /**
  * Creates a new Department
  */
  async create(createGroupDto: CreateGroupDto) {

    // verifying the existence of the responsible
    const dbResponsible = await this.responsibleRepository.findOne({
      where: {
        name: createGroupDto.name,
        isDeleted: true,
      }
    });

    // if the responsible was previously deleted then just reactivate it
    if (dbResponsible) {
      dbResponsible.isDeleted = false;
      return await this.responsibleRepository.save(dbResponsible);
    }

    // if it's not delted then continue with the normal flow of creation & validation of 
    // unique name contraint
    const createdResponsible = this.responsibleRepository.create(createGroupDto);
    try {
      return await this.responsibleRepository.save(createdResponsible);
    } catch (error) {
      throw new BadRequestException([DbOutputProcessor.processError(error, {
        entityName: 'Responsable'
      })]);
    }
  }

  /**
  *
  */
  async update(
    id: number,
    updateResponsibleDto: CreateResponsibleDto
  ) {

    const responsible = await this.responsibleRepository.findOne({
      where: {
        id,
        isDeleted: false
      }
    });

    if (!responsible) {
      throw new NotFoundException(['Responsable no encontrado']);
    }

    try {

      return await this.responsibleRepository.save({
        ...responsible,
        ...updateResponsibleDto
      });
    } catch (error) {
      throw new BadRequestException([DbOutputProcessor.processError(error, {
        entityName: 'Responsable'
      })]);
    }
  }


  /**
  *
  */
  async list(
    page: number,
    limit: number = 10
  ) {
    return await this.responsibleRepository.find({
      where: {
        isDeleted: false
      },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  /**
  *
  */
  async delete(id: number) {

    const responsible = await this.responsibleRepository.findOne({
      where: {
        id
      }
    });

    if (!responsible) {
      throw new NotFoundException(['Responsable no encontrado']);
    }

    try {
      responsible.isDeleted = true;

      return await this.responsibleRepository.save(responsible);
    } catch (error) {
      throw new BadRequestException([DbOutputProcessor.processError(error, {
        entityName: 'Responsable'
      })]);
    }
  }
}
