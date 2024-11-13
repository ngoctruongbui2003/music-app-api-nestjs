import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginDto, RegisterDto, LoginWithPlatformDto } from './dto';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto';
import { log } from 'console';
import { REGISTER_FAIL, USER_EXISTED } from 'src/constants/server';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async register(registerDto: RegisterDto) {

    const foundUser = await this.usersService.findByEmail(registerDto.email);
    if (foundUser) throw new BadRequestException('User already exists');

    const createUserDto = new CreateUserDto()
    createUserDto.email = registerDto.email
    createUserDto.display_name = registerDto.display_name
    createUserDto.password = registerDto.password

    const newUser = await this.usersService.create(createUserDto);

    if (!newUser) throw new BadRequestException(REGISTER_FAIL);

    return newUser;
  }

  async login(LoginDto: LoginDto) {

    const foundUser = await this.usersService.findByEmail(LoginDto.email);
    if (!foundUser) throw new BadRequestException(USER_EXISTED);

    return foundUser;
  }

  async loginWithPlatform(LoginWithPlatformDto: LoginWithPlatformDto) {

    const foundUser = await this.usersService.findByEmail(LoginWithPlatformDto.email);
    if (foundUser) return foundUser;

    const createUserDto = new CreateUserDto()
    createUserDto.email = LoginWithPlatformDto.email
    createUserDto.password = LoginWithPlatformDto.password
    createUserDto.display_name = LoginWithPlatformDto.display_name

    const newUser = await this.usersService.create(createUserDto);

    if (!newUser) throw new BadRequestException(REGISTER_FAIL);

    return newUser;
  }
}
