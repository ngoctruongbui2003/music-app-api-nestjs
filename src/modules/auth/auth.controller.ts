import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus, Request, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginWithPlatformDto, LoginDto } from './dto';
import { LOGIN_SUCCESS, REFRESH_TOKEN_SUCCESS, REGISTER_FAIL, REGISTER_SUCCESS } from 'src/constants/server';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from './decorators/public.decorator';
import { RefreshTokenGuard } from './guards/refresh-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/register')
  async register(@Body() registerDto: RegisterDto) {
    return {
      message: REGISTER_SUCCESS,
      data: await this.authService.register(registerDto),
    };
  }

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(@Request() req) {
    return {
      message: LOGIN_SUCCESS,
      data: await this.authService.login(req.user),
    };
  }

  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/refresh-token')
  async refreshToken(@Request() req) {
    const userId = req.user.id;
    return {
      message: REFRESH_TOKEN_SUCCESS,
      data: await this.authService.refreshToken(userId, req.body.refreshToken)
    };
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/test')
  async test() {
    return {
      message: "TEST thành công",
    };
  }

  // @Post('/login-facebook')
  // async LoginWithFacebook(@Body() loginWithPlatformDto: LoginWithPlatformDto) {
  //   return {
  //     message: LOGIN_SUCCESS,
  //     data: await this.authService.loginWithFacebook(loginWithPlatformDto),
  //   };
  // }

  // @Post('/login-google')
  // async LoginWithGoogle(@Body() loginWithPlatformDto: LoginWithPlatformDto) {
  //   return {
  //     message: LOGIN_SUCCESS,
  //     data: await this.authService.loginWithGoogle(loginWithPlatformDto),
  //   };
  // }
}
