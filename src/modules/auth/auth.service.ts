import { CreateUserDto } from './../users/dto';
import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto, RegisterDto, LoginWithPlatformDto } from './dto';
import { UsersService } from '../users/users.service';
import { LOGIN_FAIL, REGISTER_FAIL, USER_EXISTED } from 'src/constants/server';
import { plainToInstance } from 'class-transformer';
import { AccountType } from 'src/constants/enum';
import { comparePassword, compareToken, generateTokens, hashPassword, verifyAccessToken } from 'src/utils';
import { MailService } from '../mail/mail.service';
import { RegisterMailDto } from '../mail/dto';
import { JwtService } from '@nestjs/jwt';
import { config } from 'src/shared';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private readonly mailService: MailService,
    private jwtService: JwtService 
  ) {}

  async validateUser(email: string, password: string) {
    // 1. Check if user not existed
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    // 2. Compare password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return null;

    return user;
  }

  async register(registerDto: RegisterDto) {
    // 1. Check if user existed
    const foundUser = await this.usersService.findByEmail(registerDto.email);
    if (foundUser) throw new BadRequestException(USER_EXISTED);

    // 2. Hash password
    const { password } = registerDto;
    const passwordHash = password ? await hashPassword(password) : "";

    // 3. Create new user
    const createUserDto = plainToInstance(CreateUserDto, {
      ...registerDto,
      password: passwordHash,
      country: registerDto.country ?? 'VietNam'
    });
    const newUser = await this.usersService.create(createUserDto);
    if (!newUser) throw new BadRequestException(REGISTER_FAIL);

    // 4. Send mail
    const registerMailDto = plainToInstance(RegisterMailDto, createUserDto)
    this.mailService.registerMail(registerMailDto);

    return newUser;
  }

  async login(user: any) {
    // 1. Generate token and refresh token
    const payload = { sub: user.id, email: user.email };
    const token = generateTokens(this.jwtService, payload);

    // 2. Update refresh token and hash it
    const hashRefreshToken = await hashPassword(token.refreshToken);
    await this.usersService.update(user.id, { refreshToken: hashRefreshToken });

    return token;
  }

  async refreshToken(userId: string, refreshToken: string) {
    // 1. Check if user existed and refresh token existed
    const user = await this.usersService.findOne(userId);
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Refresh token không hợp lệ!');
    }

    // 2. Compare refresh token
    const isMatch = await compareToken(refreshToken, user.refreshToken);
    if (!isMatch) {
      throw new UnauthorizedException('Refresh token sai hoặc đã hết hạn!');
    }

    // 3. Generate new token
    const newToken = generateTokens(this.jwtService, { sub: user.id, email: user.email });

    // 4. Update refresh token
    const hashRefreshToken = await hashPassword(newToken.refreshToken);
    await this.usersService.update(userId, { refreshToken: hashRefreshToken });

    return newToken;
  }

  // async loginWithPlatform(LoginWithPlatformDto: LoginWithPlatformDto, account_type: string) {

  //   const foundUser = await this.usersService.findByProps({
  //     email: LoginWithPlatformDto.email,
  //     account_type
  //   });
  //   if (foundUser) return foundUser;

  //   const createUserDto = plainToInstance(CreateUserDto, {
  //     ...LoginWithPlatformDto,
  //     country: LoginWithPlatformDto.country ?? 'VietNam',
  //     account_type
  //   })
  //   // const createUserDto = new CreateUserDto()
  //   // createUserDto.email = LoginWithPlatformDto.email
  //   // createUserDto.password = LoginWithPlatformDto.password
  //   // createUserDto.display_name = LoginWithPlatformDto.display_name

  //   const newUser = await this.usersService.create(createUserDto);

  //   if (!newUser) throw new BadRequestException(REGISTER_FAIL);

  //   // send mail
  //   const registerMailDto = plainToInstance(RegisterMailDto, createUserDto)
  //   this.mailService.registerMail(registerMailDto);

  //   return newUser;
  // }

  // async loginWithGoogle(LoginWithPlatformDto: LoginWithPlatformDto) {
  //   return await this.loginWithPlatform(LoginWithPlatformDto, AccountType.GOOGLE);
  // }

  // async loginWithFacebook(LoginWithPlatformDto: LoginWithPlatformDto) {
  //   return await this.loginWithPlatform(LoginWithPlatformDto, AccountType.FACEBOOK);
  // }
}
