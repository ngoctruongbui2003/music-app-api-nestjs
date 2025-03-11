import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, FindUserDto, UpdateUserDto, UpdateUserPasswordDto } from './dto';
import { CREATE_SUCCESS, DELETE_SUCCESS, GET_ALL_SUCCESS, GET_SUCCESS, UPDATE_SUCCESS } from 'src/constants/server';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return {
      message: CREATE_SUCCESS,
      data: await this.usersService.create(createUserDto),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async getMyProfile(@Request() req) {
    const user = await this.usersService.getProlife(req.user.id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      message: GET_SUCCESS,
      data: user
    };
  }

  @Get(':id')
  async getPublicUser(@Param('id') id: string) {
    const user = await this.usersService.getPublicUser(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return { message: 'Public user profile retrieved', data: user };
  }

  // @Patch(':id')
  // async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return {
  //     message: UPDATE_SUCCESS,
  //     data: await this.usersService.update(id, updateUserDto)
  //   };
  // }

  // @Patch('/change-password/:id')
  // async updatePassword(
  //   @Param('id') id: string,
  //   @Body() updateUserPasswordDto: UpdateUserPasswordDto
  // ) {
  //   return {
  //     message: UPDATE_SUCCESS,
  //     data: await this.usersService.updatePassword(id, updateUserPasswordDto)
  //   };
  // }

  // @Delete(':id')
  // async remove(@Param('id') id: string) {
  //   return {
  //     message: DELETE_SUCCESS,
  //     data: await this.usersService.remove(id)
  //   };
  // }
}
