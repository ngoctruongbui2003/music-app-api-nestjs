import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TrackPlaylist } from 'src/schemas/track.playlist.schema';
import { CreateTrackPlaylistDto, UpdateTrackPlaylistDto } from './dto';

@Injectable()
export class TrackPlaylistService {
  constructor(@InjectModel(TrackPlaylist.name) private trackPlaylistModel: Model<TrackPlaylist>) {}

  create(createTrackPlaylistDto: CreateTrackPlaylistDto) {
    return 'This action adds a new trackPlaylist';
  }

  findAll() {
    return `This action returns all trackPlaylist`;
  }

  findOne(id: number) {
    return `This action returns a #${id} trackPlaylist`;
  }

  update(id: number, updateTrackPlaylistDto: UpdateTrackPlaylistDto) {
    return `This action updates a #${id} trackPlaylist`;
  }

  remove(id: number) {
    return `This action removes a #${id} trackPlaylist`;
  }
}
