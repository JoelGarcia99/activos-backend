import { Controller, Post, Body, UseGuards, Req, Get, Delete, Param, Patch, UseInterceptors } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { JwtAuthGuard as JwtGuard } from 'src/auth/guards/auth.guard';
import { DeletionDto } from './dto/delete.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { AddSubgroupDto } from './dto/add-subgroups.dto';
import { JwtStrategyOutput } from 'src/jwt/strategy';

@Controller('groups')
@UseGuards(JwtGuard)
export class GroupsController {
  constructor(
    private readonly groupsService: GroupsService,
  ) { }

  /**
  * Eager creation of Group & associated subgroups.
  **/
  @Post()
  @UseGuards(AdminGuard)
  async create(@Body() createGroupDto: CreateGroupDto) {
    return await this.groupsService.createWithSubgroups(createGroupDto);
  }

  /**
  * List all groups and subgroups.
  * NOTE: So far it doesn't require pagination since the number of groups/subroups isn't 
  * gonna grow very much as to cause performance issues.
  */
  @Get()
  async list() {
    return await this.groupsService.list();
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async delete(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() deleteGroupDto: DeletionDto
  ) {
    const { userId } = req['user'] as JwtStrategyOutput;
    return await this.groupsService.delete(+userId, deleteGroupDto, +id);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  async updateGroup(
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    return await this.groupsService.updateGroup(
      updateGroupDto,
      +id
    );
  }

  @Patch('subgroup/:id')
  @UseGuards(AdminGuard)
  async updateSubgroup(
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    return await this.groupsService.updateSubgroup(
      updateGroupDto,
      +id
    );
  }

  @Delete('subgroup/:id')
  @UseGuards(AdminGuard)
  async deleteSubgroup(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() deleteGroupDto: DeletionDto
  ) {
    const { userId } = req['user'] as JwtStrategyOutput;
    return await this.groupsService.deleteSubgroup(+userId, deleteGroupDto, +id);
  }

  @Post('add-subgroups')
  @UseGuards(AdminGuard)
  async addSubgroups(
    @Body() addSubgroupsDto: AddSubgroupDto
  ) {
    return await this.groupsService.addSubgroups(addSubgroupsDto);
  }
}
