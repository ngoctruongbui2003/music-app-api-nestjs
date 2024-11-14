import { Injectable } from '@nestjs/common';
import { CreatePlaylistDto, UpdatePlaylistDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { Playlist } from 'src/schemas/playlist.schema';
import { Model } from 'mongoose';

@Injectable()
export class PlaylistsService {
  constructor(@InjectModel(Playlist.name) private playlistModel: Model<Playlist>) {}

  create(createPlaylistDto: CreatePlaylistDto) {
    return 'This action adds a new playlist';
  }

  findAll() {
    return `This action returns all playlists`;
  }

  findOne(id: number) {
    return `This action returns a #${id} playlist`;
  }

  update(id: number, updatePlaylistDto: UpdatePlaylistDto) {
    return `This action updates a #${id} playlist`;
  }

  remove(id: number) {
    return `This action removes a #${id} playlist`;
  }
}
