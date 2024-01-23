import { Controller, Get, Body, Patch, Param, Delete, UseGuards, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/auth.guard';
import { ResponseBuilder } from 'src/utils/response/builder';
import { RootGuard } from './guards/root.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

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

  // TODO: test it
  @Get('/admins')
  @UseGuards(JwtAuthGuard, RootGuard)
  async listAdmins(request: Request) {
    return ResponseBuilder.build(
      request,
      async (_) => await this.authService.loadAdmins(),
    );
  }

  /**
   * Registers a new user, only ROOT user can do this for security reasons
   */
  @Post('/register')
  @UseGuards(JwtAuthGuard, RootGuard)
  async register(request: Request, @Body() createUserDto: CreateUserDto) {

    console.log(`INFO: Root user is trying to register a new user with role ${createUserDto.role}`);
    return ResponseBuilder.build(
      request,
      async (_) => await this.authService.register(createUserDto),
    );
  }

  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }
}
