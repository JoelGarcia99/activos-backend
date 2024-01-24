import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { ResponseBuilder } from 'src/utils/response/builder';
import { JwtAuthGuard as JwtGuard } from 'src/auth/guards/auth.guard';

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
}
