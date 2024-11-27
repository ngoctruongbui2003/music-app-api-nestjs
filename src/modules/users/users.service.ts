import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, FindUserDto, UpdateUserDto, UpdateUserPasswordDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { comparePassword, hashPassword } from 'src/utils';
import { ACCOUNT_TYPE_NOT_LOCAL, INVALID_PASSWORD, SAME_OLD_PASSWORD, USER_NOT_FOUND } from 'src/constants/server';
import { AccountType } from 'src/constants/enum';

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
                  .populate(findUserDto.isPopulatePlaylist ? 'playlists' : '')
                  .select(findUserDto.chosenSelect);
    return {
      total: users.length,
      data: users,
    };
  }

  async findOne(id: string, findUserDto: FindUserDto) {
    const user = await this.userModel
                .findById(id)
                .populate(findUserDto.isPopulatePlaylist ? 'playlists' : '')
                .select(findUserDto.chosenSelect);
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    return user;
  }

  async findByProps(props: Record<string, any>) {
    const user = await this.userModel.findOne(props);
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      updateUserDto,
      { new: true }
    )
    if (!user) throw new BadRequestException(USER_NOT_FOUND);

    return user;
  }

  async updatePassword(id: string, updateUserPasswordDto: UpdateUserPasswordDto) {
    // find user
    const foundUser = await this.userModel.findById(id);
    if (!foundUser) throw new BadRequestException(USER_NOT_FOUND);

    // check account-type
    if (foundUser.account_type !== AccountType.LOCAL)
      throw new BadRequestException(ACCOUNT_TYPE_NOT_LOCAL);

    // check old password
    const isMatch = await comparePassword(updateUserPasswordDto.oldPassword, foundUser.password);
    if (!isMatch) throw new BadRequestException(INVALID_PASSWORD);

    // check the same new password and old password
    const isSame = await comparePassword(updateUserPasswordDto.newPassword, foundUser.password);
    if (isSame) throw new BadRequestException(SAME_OLD_PASSWORD);

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
