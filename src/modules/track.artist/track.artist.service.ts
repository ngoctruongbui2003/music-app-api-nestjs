import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TrackArtist } from 'src/schemas/track.artist.schema';
import { Model } from 'mongoose';
import { CreateTrackArtistDto, UpdateTrackArtistDto } from './dto';

@Injectable()
export class TrackArtistService {
  constructor(@InjectModel(TrackArtist.name) private trackArtistModel: Model<TrackArtist>) {}

  create(createTrackArtistDto: CreateTrackArtistDto) {
    return 'This action adds a new trackArtist';
  }

  findAll() {
    return `This action returns all trackArtist`;
  }

  findOne(id: number) {
    return `This action returns a #${id} trackArtist`;
  }

  update(id: number, updateTrackArtistDto: UpdateTrackArtistDto) {
    return `This action updates a #${id} trackArtist`;
  }

  remove(id: number) {
    return `This action removes a #${id} trackArtist`;
  }
}
