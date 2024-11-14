import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserPlaylist } from 'src/schemas/user.playlist.schema';
import { CreateUserPlaylistDto, UpdateUserPlaylistDto } from './dto';

@Injectable()
export class UserPlaylistService {
  constructor(@InjectModel(UserPlaylist.name) private userPlaylistModel: Model<UserPlaylist>) {}

  create(createUserPlaylistDto: CreateUserPlaylistDto) {
    return 'This action adds a new userPlaylist';
  }

  findAll() {
    return `This action returns all userPlaylist`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userPlaylist`;
  }

  update(id: number, updateUserPlaylistDto: UpdateUserPlaylistDto) {
    return `This action updates a #${id} userPlaylist`;
  }

  remove(id: number) {
    return `This action removes a #${id} userPlaylist`;
  }
}
