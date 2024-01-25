import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from './entities/department.entity';
import { Repository } from 'typeorm';
import { DbOutputProcessor } from 'src/utils/processors/mysql.errors';
import { randomInt } from 'crypto';
import { DeletionDto } from 'src/groups/dto/delete.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class DepartmentService {

  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
    private readonly authService: AuthService,
  ) { }

  /**
  *
  */
  async create(createDepartmentDto: CreateDepartmentDto) {
    const department = this.departmentRepository.create({
      ...createDepartmentDto,
      companyIdentifier: '01',
      branchIdentifier: '01',
      departmentCode: randomInt(999).toString().padStart(3, '0'),
    });

    try {
      return await this.departmentRepository.save(department);
    } catch (error) {
      throw new BadRequestException([DbOutputProcessor.processError(error, {
        entityName: 'Departamento'
      })]);
    }
  }

  /**
   *
   */
  async list() {
    return await this.departmentRepository.find();
  }

  /**
   *
   */
  async update(id: number, updateDepartmentDto: CreateDepartmentDto) {
    const department = await this.departmentRepository.findOne({
      where: {
        id,
      }
    });

    if (!department) {
      throw new NotFoundException([`El departamento no existe`]);
    }

    department.name = updateDepartmentDto.name;

    try {
      return await this.departmentRepository.save(department);
    } catch (error) {
      throw new BadRequestException([DbOutputProcessor.processError(error, {
        entityName: 'Departamento'
      })]);
    }
  }

  /**
   * WARN: this is a hard delete, it'll completely destroy the record from the DB as well 
   * as all the related assets. User's password must be provided
   */
  async delete(
    id: number,
    deleteDepartmentDto: DeletionDto,
    userId: number
  ) {

    const passwordMatches = await this.authService.checkPassword(
      userId,
      deleteDepartmentDto.password,
      null
    );

    if (!passwordMatches) {
      throw new ForbiddenException(['Contraseña incorrecta']);
    }

    await this.departmentRepository.delete({
      id,
    });

    return {
      message: 'Departamento eliminado junto con sus activos',
    }
  }
}
