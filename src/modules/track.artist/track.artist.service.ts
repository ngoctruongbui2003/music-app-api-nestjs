import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TrackArtist } from 'src/schemas/track.artist.schema';
import { Model } from 'mongoose';
import { CreateTrackArtistDto, UpdateTrackArtistDto } from './dto';

@Injectable()
export class TrackArtistService {
  constructor(@InjectModel(TrackArtist.name) private trackArtistModel: Model<TrackArtist>) {}

  async create(createTrackArtistDto: CreateTrackArtistDto) {
    const newTrackArtist = await this.trackArtistModel.create(createTrackArtistDto);

    return newTrackArtist;
  }

  async findAll() {
    return await this.trackArtistModel.find();
  }

  async findOne(id: number) {
    return await this.trackArtistModel.findById(id);
  }

  async update(id: number, updateTrackArtistDto: UpdateTrackArtistDto) {
    const updatedTrackArtist = await this.trackArtistModel.findByIdAndUpdate(id, updateTrackArtistDto);
    return updatedTrackArtist;
  }

  async remove(id: number) {
    const deletedTrackArtist = await this.trackArtistModel.findByIdAndDelete(id);

    return deletedTrackArtist;
  }
}
