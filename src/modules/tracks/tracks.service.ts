import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTrackDto, UpdateTrackDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { Track } from 'src/schemas/track.schema';
import { Model, Types } from 'mongoose';
import { artistsForIdMongo, songs } from 'src/db/fake';
import { CREATE_FAIL, TRACK_NOT_FOUND } from 'src/constants/server';
import { convertObjectId } from 'src/utils';

@Injectable()
export class TracksService {
  constructor(@InjectModel(Track.name) private trackModel: Model<Track>) {}

  async create(createTrackDto: CreateTrackDto) {
    const newTrack = await this.trackModel.create(createTrackDto);
    if (!newTrack) throw new BadRequestException(CREATE_FAIL);

    return newTrack;
  }

  async createAvailable() {
    let listTrack = [];

    for (const track of songs) {
      // get artists in song
      let artists = [];
      for (const artist of track.artist) {
        artists.push(artistsForIdMongo[artist]);
      }

      console.log(artists);

      const createTrackDto = new CreateTrackDto();
      createTrackDto.title = track.title;
      createTrackDto.duration_ms = 0;
      createTrackDto.genre = "pop";
      createTrackDto.image_url = track.cover_img;
      createTrackDto.url_media = track.url_media;
      createTrackDto.album_order_position = 0;
      createTrackDto.isPlayable = true;
      createTrackDto.isExplicit = true;
      createTrackDto.artists = artists;
      createTrackDto.createdBy = artists[0];
      createTrackDto.release_date = new Date();

      console.log(createTrackDto);
      

      const newTrack = await this.create(createTrackDto);
      if (!newTrack) throw new BadRequestException(CREATE_FAIL);

      newTrack.save();

      // const foundTrack = await this.trackModel.findOne({ _id: newTrack._id }).populate('artists').populate('createdBy').lean();
      // let i = 0;
      // for (const artist of artists) {
      //   console.log("1:" + foundTrack.artists[i++].name);
      //   console.log("2:" + foundTrack.createdBy.name);
        
      // }
        

      listTrack.push(newTrack);
    }

    return listTrack;
  }

  findAll() {
    return `This action returns all tracks`;
  }

  async findOne(id: string) {
    const foundTrack = await this.trackModel
                              .findOne({ _id: convertObjectId(id) })
                              .populate('artists')
                              .populate('createdBy')
                              .lean();
    
    if (!foundTrack) throw new BadRequestException(TRACK_NOT_FOUND);

    return foundTrack;
  }

  update(id: number, updateTrackDto: UpdateTrackDto) {
    return `This action updates a #${id} track`;
  }

  remove(id: number) {
    return `This action removes a #${id} track`;
  }
}
