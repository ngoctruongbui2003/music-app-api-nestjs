import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, FindUserDto, UpdateUserDto, UpdateUserPasswordDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { comparePassword, hashPassword } from 'src/utils';
import { INVALID_PASSWORD, USER_NOT_FOUND } from 'src/constants/server';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  
  async create(createUserDto: CreateUserDto) {
    const { password, ...rest } = createUserDto;
    const passwordHash = password ? await hashPassword(password) : "";

    const newUser = await this.userModel.create({
      ...rest,
      password: passwordHash,
    });

    return newUser;
  }

  async findAll(findUserDto: FindUserDto) {
    const users = await this.userModel
                  .find()
                  .populate(findUserDto.isPopulateUserPlaylist ? 'userPlaylists' : '')
                  .select(findUserDto.chosenSelect);
    return users;
  }

  async findOne(id: string, findUserDto: FindUserDto) {
    const user = await this.userModel
                .findById(id)
                .populate(findUserDto.isPopulateUserPlaylist ? 'userPlaylists' : '')
                .select(findUserDto.chosenSelect);
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findByIdAndUpdate(id, updateUserDto)
    user.save();

    return user;
  }

  async updatePassword(id: string, updateUserPasswordDto: UpdateUserPasswordDto) {
    // find user
    const foundUser = await this.userModel.findById(id);
    if (!foundUser) throw new BadRequestException(USER_NOT_FOUND);

    // check old password
    const isMatch = await comparePassword(updateUserPasswordDto.oldPassword, foundUser.password);
    if (!isMatch) throw new BadRequestException(INVALID_PASSWORD);

    // update password
    const newPassword = await hashPassword(updateUserPasswordDto.newPassword);
    foundUser.password = newPassword;
    foundUser.save();

    delete foundUser.password;
    return foundUser;
  }

  async remove(id: string) {
    const user = await this.userModel.findByIdAndDelete(id);
    return user;
  }
}
