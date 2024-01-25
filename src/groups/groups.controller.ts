import { Controller, Post, Body, UseGuards, Req, Get, Delete, Param, Patch } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { ResponseBuilder } from 'src/utils/response/builder';
import { JwtAuthGuard as JwtGuard } from 'src/auth/guards/auth.guard';
import { DeletionDto } from './dto/delete.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { AddSubgroupDto } from './dto/add-subgroups.dto';

@Controller('groups')
export class GroupsController {
  constructor(
    private readonly groupsService: GroupsService,
  ) { }

  /**
  * Eager creation of Group & associated subgroups.
  **/
  @Post()
  @UseGuards(JwtGuard, AdminGuard)
  async create(@Req() req: Request, @Body() createGroupDto: CreateGroupDto) {
    return await ResponseBuilder.build(
      req, async (_) => await this.groupsService.createWithSubgroups(createGroupDto),
    );
  }

  /**
  * List all groups and subgroups.
  * NOTE: So far it doesn't require pagination since the number of groups/subroups isn't 
  * gonna grow very much as to cause performance issues.
  */
  @Get()
  @UseGuards(JwtGuard)
  async list(@Req() req: Request) {
    return await ResponseBuilder.build(
      req, async (_) => await this.groupsService.list(),
    );
  }

  @Delete(':id')
  @UseGuards(JwtGuard, AdminGuard)
  async delete(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() deleteGroupDto: DeletionDto
  ) {
    return await ResponseBuilder.build(
      req, async (userId) => await this.groupsService.delete(+userId, deleteGroupDto, +id),
    );
  }

  @Patch(':id')
  @UseGuards(JwtGuard, AdminGuard)
  async updateGroup(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    return await ResponseBuilder.build(
      req, async (_) => await this.groupsService.updateGroup(
        updateGroupDto,
        +id
      ),
    );
  }

  @Patch('subgroup/:id')
  @UseGuards(JwtGuard, AdminGuard)
  async updateSubgroup(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    return await ResponseBuilder.build(
      req, async (_) => await this.groupsService.updateSubgroup(
        updateGroupDto,
        +id
      ),
    );
  }

  @Delete('subgroup/:id')
  @UseGuards(JwtGuard, AdminGuard)
  async deleteSubgroup(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() deleteGroupDto: DeletionDto
  ) {
    return await ResponseBuilder.build(
      req, async (userId) => await this.groupsService.deleteSubgroup(+userId, deleteGroupDto, +id),
    );
  }

  @Post('add-subgroups')
  @UseGuards(JwtGuard, AdminGuard)
  async addSubgroups(
    @Req() req: Request,
    @Body() addSubgroupsDto: AddSubgroupDto
  ) {
    return await ResponseBuilder.build(
      req, async (_) => await this.groupsService.addSubgroups(addSubgroupsDto),
    );
  }
}
