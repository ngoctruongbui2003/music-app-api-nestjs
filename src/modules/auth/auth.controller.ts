import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginWithPlatformDto, LoginDto } from './dto';
import { LOGIN_SUCCESS, REGISTER_FAIL, REGISTER_SUCCESS } from 'src/constants/server';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() registerDto: RegisterDto) {
    return {
      message: REGISTER_SUCCESS,
      data: await this.authService.register(registerDto),
    };
  }

  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    return {
      message: LOGIN_SUCCESS,
      data: await this.authService.login(loginDto),
    };
  }

  @Post('/login-platform')
  async LoginWithPlatform(@Body() loginWithPlatformDto: LoginWithPlatformDto) {
    return {
      message: LOGIN_SUCCESS,
      data: await this.authService.loginWithPlatform(loginWithPlatformDto),
    };
  }
}
