import { Controller, Get, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/auth.guard';
import { ResponseBuilder } from 'src/utils/response/builder';
import { AdminGuard } from './guards/admin.guard';
import { RootGuard } from './guards/root.guard';

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
  @UseGuards(JwtAuthGuard, RootGuard)
  async listAdmins(request: Request) {
    return ResponseBuilder.build(
      request,
      async (_) => await this.authService.loadAdmins(),
    );
  }
}
