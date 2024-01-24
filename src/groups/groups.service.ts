import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { DbOutputProcessor } from 'src/utils/processors/mysql.errors';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) { }


  /**
  * It'll create a new group and its associated subgroups (if any). It'll also generate 
  * the group code and company identifier automatically.
  */
  async createWithSubgroups(createGroupDto: CreateGroupDto) {
    const group = this.groupRepository.create({
      groupCode: randomBytes(3).toString('utf8'),
      ...createGroupDto
    });

    try {
      const insertedRecord = await this.groupRepository.save(group);

      return insertedRecord;
    } catch (error) {
      return DbOutputProcessor.processError(error, {
        entityName: 'Grupo'
      });
    }
  }
}
