import { Controller, Get, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UpdateAuthDto } from './dto/update-user.dto';
import { JwtAuthGuard } from './guards/auth.guard';
import { ResponseBuilder } from 'src/utils/response/builder';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  /**
  * Endpoint used to evaluate the health of the node
  */
  @Get('/ping')
  ping() {
    return {
      status: "healthy",
      message: "pong"
    };
  }

  @Get('/admins')
  @UseGuards(JwtAuthGuard)
  async listAdmins(request: Request) {
    return ResponseBuilder.build(
      request,
      async (_) => await this.authService.loadAdmins(),
    );
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
