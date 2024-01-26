import { Controller, Get, Body, Param, UseGuards, Post, Request, Patch, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/auth.guard';
import { RootGuard } from './guards/root.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtStrategyOutput } from 'src/jwt/strategy';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

  /**
   * Retrieves all the users except the ROOT user
   */
  @Get('/users')
  @UseGuards(JwtAuthGuard, RootGuard)
  async listUsers() {
    return await this.authService.loadUsers();
  }

  /**
   * Registers a new user, only ROOT user can do this for security reasons
   */
  @Post('/register')
  @UseGuards(JwtAuthGuard, RootGuard)
  async register(
    @Body() createUserDto: CreateUserDto
  ) {
    return await this.authService.register(createUserDto)
  }

  @UseGuards(JwtAuthGuard)
  @Get('/check-session')
  async checkSession(@Request() req: Request) {
    const guardOutput = req['user'] as JwtStrategyOutput;

    return await this.authService.checkSession(guardOutput);
  }


  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  async logout(@Request() req: Request) {
    const guardOutput = req['user'] as JwtStrategyOutput;

    return await this.authService.logout(guardOutput);
  }

  @Post('send-recovery-code/:email')
  async sendRecoveryCode(@Param('email') email: string) {
    return await this.authService.sendRecoveryCode(email);
  }

  @Post('recovery-password')
  async changePassword(@Body() body: ChangePasswordDto) {
    return await this.authService.changePassword(body);
  }

  @Post('deactivate-user/:email')
  @UseGuards(JwtAuthGuard, RootGuard)
  async deactivateUser(@Param('email') email: string) {
    return await this.authService.deactivateUser(email);
  }

  @Post('activate-user/:email')
  @UseGuards(JwtAuthGuard, RootGuard)
  async activateUser(@Param('email') email: string) {
    return await this.authService.activateUser(email);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/user')
  async update(
    @Request() req: Request,
    @Body() body: UpdateUserDto,
  ) {
    const guardOutput = req['user'] as JwtStrategyOutput;

    return await this.authService.updateUser(guardOutput, body);
  }
}
