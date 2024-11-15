import { CreateUserDto } from './../users/dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginDto, RegisterDto, LoginWithPlatformDto } from './dto';
import { UsersService } from '../users/users.service';
import { LOGIN_FAIL, REGISTER_FAIL, USER_EXISTED } from 'src/constants/server';
import { plainToInstance } from 'class-transformer';
import { AccountType } from 'src/constants/enum';
import { comparePassword } from 'src/utils';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async register(registerDto: RegisterDto) {

    const foundUser = await this.usersService.findByEmail(registerDto.email);
    if (foundUser) throw new BadRequestException(USER_EXISTED);

    const createUserDto = plainToInstance(CreateUserDto, {
      ...registerDto,
      country: registerDto.country ?? 'VietNam'
    });

    // const createUserDto = new CreateUserDto()
    // createUserDto.email = registerDto.email
    // createUserDto.display_name = registerDto.display_name
    // createUserDto.password = registerDto.password
    // createUserDto.country = registerDto.country ?? 'VietNam'

    const newUser = await this.usersService.create(createUserDto);

    if (!newUser) throw new BadRequestException(REGISTER_FAIL);

    return newUser;
  }

  async login(loginDto: LoginDto) {

    const foundUser = await this.usersService.findByEmail(loginDto.email);
    if (!foundUser) throw new BadRequestException(USER_EXISTED);

    const isMatch = await comparePassword(loginDto.password, foundUser.password);
    if (!isMatch) throw new BadRequestException(LOGIN_FAIL);

    await delete foundUser.password;

    return foundUser;
  }

  async loginWithPlatform(LoginWithPlatformDto: LoginWithPlatformDto, account_type: string) {

    const foundUser = await this.usersService.findByEmail(LoginWithPlatformDto.email);
    if (foundUser) return foundUser;

    const createUserDto = plainToInstance(CreateUserDto, {
      ...LoginWithPlatformDto,
      country: LoginWithPlatformDto.country ?? 'VietNam',
      account_type
    })
    // const createUserDto = new CreateUserDto()
    // createUserDto.email = LoginWithPlatformDto.email
    // createUserDto.password = LoginWithPlatformDto.password
    // createUserDto.display_name = LoginWithPlatformDto.display_name

    const newUser = await this.usersService.create(createUserDto);

    if (!newUser) throw new BadRequestException(REGISTER_FAIL);

    return newUser;
  }

  async loginWithGoogle(LoginWithPlatformDto: LoginWithPlatformDto) {
    return await this.loginWithPlatform(LoginWithPlatformDto, AccountType.GOOGLE);
  }

  async loginWithFacebook(LoginWithPlatformDto: LoginWithPlatformDto) {
    return await this.loginWithPlatform(LoginWithPlatformDto, AccountType.FACEBOOK);
  }
}
