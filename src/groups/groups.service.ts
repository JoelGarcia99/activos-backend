import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { Repository } from 'typeorm';
import { randomBytes, randomInt } from 'crypto';
import { DbOutputProcessor } from 'src/utils/processors/mysql.errors';
import { DeleteGroupDto } from './dto/delete.dto';
import { AuthService } from 'src/auth/auth.service';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Subgroup } from './entities/subgroup.entity';

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
    deleteGroupDto: DeleteGroupDto,
    groupId: number,
  ) {
    const passwordMatches = await this.authService.checkPassword(
      userId,
      deleteGroupDto.password,
      null
    );

    if (!passwordMatches) {
      throw new ForbiddenException('Contraseña incorrecta');
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
      throw new BadRequestException(['El grupo no existe']);
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
      throw new BadRequestException(['El subgrupo no existe']);
    }

    return await this.subgroupRepository.save({
      ...subgroup,
      ...updateGroupDto
    });
  }
}
