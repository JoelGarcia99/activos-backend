import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { Repository } from 'typeorm';
import { randomInt } from 'crypto';
import { DbOutputProcessor } from 'src/utils/processors/mysql.errors';
import { DeletionDto } from './dto/delete.dto';
import { AuthService } from 'src/auth/auth.service';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Subgroup } from './entities/subgroup.entity';
import { AddSubgroupDto } from './dto/add-subgroups.dto';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(Subgroup)
    private readonly subgroupRepository: Repository<Subgroup>,
    private readonly authService: AuthService,
  ) { }


  /**
  * It'll create a new group and its associated subgroups (if any). It'll also generate 
  * the group code and company identifier automatically.
  */
  async createWithSubgroups(createGroupDto: CreateGroupDto) {
    const group = this.groupRepository.create({
      // a three digits auto generated number
      companySerial: '01',
      sucursal: '01',
      groupCode: randomInt(999).toString().padStart(3, '0'),
      ...createGroupDto
    });

    // cleaning and validating unique values during creation
    const subgroups = group.subgroups ?? [];
    const aux = new Set();

    for (const subgroup of subgroups) {
      if (aux.has(subgroup.name)) {
        throw new BadRequestException([`El subgrupo ${subgroup.name} está repetido`]);
      }
      aux.add(subgroup.name);
    }

    try {
      const insertedRecord = await this.groupRepository.save(group);

      return insertedRecord;
    } catch (error) {
      throw new BadRequestException([DbOutputProcessor.processError(error, {
        entityName: 'Grupo'
      })]);
    }
  }


  /**
   * Lists all the groups with eager subgroups loading.
   * NOTE: it doesn't implement pagination since it's not required
   */
  async list() {
    return await this.groupRepository.find();
  }


  /**
  * WARNING: This is a hard delete. It'll delete the group, all its subgroups and its 
  * related products as well.
  */
  async delete(
    userId: number,
    deleteGroupDto: DeletionDto,
    groupId: number,
  ) {
    const passwordMatches = await this.authService.checkPassword(
      userId,
      deleteGroupDto.password,
      null
    );

    if (!passwordMatches) {
      throw new ForbiddenException(['Contraseña incorrecta']);
    }

    await this.groupRepository.delete({
      id: groupId
    });

    return {
      message: 'El grupo, subgrupos, y activos han sido eliminados',
    }
  }


  /**
  *
  *
  */
  async updateGroup(
    updateGroupDto: UpdateGroupDto,
    groupId: number
  ) {
    const group = await this.groupRepository.findOne({
      where: { id: groupId }
    });

    if (!group) {
      throw new NotFoundException(['El grupo no existe']);
    }

    return await this.groupRepository.save({
      ...group,
      ...updateGroupDto
    });
  }

  /**
   *
   *
   */
  async updateSubgroup(
    updateGroupDto: UpdateGroupDto,
    subgroupId: number
  ) {
    const subgroup = await this.subgroupRepository.findOne({
      where: { id: subgroupId }
    });

    if (!subgroup) {
      throw new NotFoundException(['El subgrupo no existe']);
    }

    return await this.subgroupRepository.save({
      ...subgroup,
      ...updateGroupDto
    });
  }

  /**
   *
   */
  async deleteSubgroup(
    userId: number,
    deleteGroupDto: DeletionDto,
    subgroupId: number
  ) {
    const passwordMatches = await this.authService.checkPassword(
      userId,
      deleteGroupDto.password,
      null
    );

    if (!passwordMatches) {
      throw new ForbiddenException(['Contraseña incorrecta']);
    }

    await this.subgroupRepository.delete({
      id: subgroupId
    });

    return {
      message: 'El subgrupo y sus activos han sido eliminados',
    }
  }


  /**
  *
  */
  async addSubgroups(addSubgroupsDto: AddSubgroupDto) {
    // searching for the group to determine if it does exist
    const group = await this.groupRepository.findOne({
      where: { id: addSubgroupsDto.groupId }
    });

    if (!group) {
      throw new NotFoundException(['El grupo no existe']);
    }

    // getting the subgroups and validating they are not repeated
    const subgroups = addSubgroupsDto.subgroups;
    const subgroupsSet = new Set(subgroups);

    if (subgroupsSet.size < subgroups.length) {
      throw new BadRequestException(['Algunos subgrupos están repetidos']);
    }

    const allSubgroupsSet = new Set([...group.subgroups, ...subgroups]);

    if (allSubgroupsSet.size !== group.subgroups.length + subgroups.length) {
      throw new BadRequestException(['Algunos subgrupos ya existen']);
    }

    // Transforming the subgroups to be readable by the groups and TypeORM
    const subgroupsEntities = subgroups.map((subgroup) => {
      return this.subgroupRepository.create({
        ...subgroup,
        groupId: addSubgroupsDto.groupId
      });
    });

    await this.subgroupRepository.save(subgroupsEntities);

    return {
      message: 'Los subgrupos han sido actualizados'
    };
  }
}
