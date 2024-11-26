import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTrackDto, UpdateTrackDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { Track } from 'src/schemas/track.schema';
import { Model, Types } from 'mongoose';
import { albums, albumsForIdMongo, artistsForIdMongo, songs } from 'src/db/fake';
import { CREATE_FAIL, TRACK_NOT_FOUND } from 'src/constants/server';
import { convertObjectId } from 'src/utils';
import { Genre } from 'src/constants/enum';
import { TrackArtistService } from '../track.artist/track.artist.service';
import { CreateTrackArtistDto } from '../track.artist/dto';
import { AlbumsService } from '../albums/albums.service';

@Injectable()
export class TracksService {
  constructor(
    @InjectModel(Track.name) private trackModel: Model<Track>,
    private readonly albumService: AlbumsService,
    private readonly trackArtistService: TrackArtistService,
  ) {}

  async create(createTrackDto: CreateTrackDto) {
    const newTrack = await this.trackModel.create(createTrackDto);
    if (!newTrack) throw new BadRequestException(CREATE_FAIL);

    return newTrack;
  }

  async createAvailable() {
    let listTrack = [];

    for (const track of songs) {
      // get artists in song
      let artists = track.artist;

      // create track
      const createTrackDto = new CreateTrackDto();
      createTrackDto.title = track.title;
      createTrackDto.duration_ms = 0;
      createTrackDto.genre = [Genre.POP, Genre.RAP];
      createTrackDto.description = 'Đây là bài hát của ' + artists[0];
      createTrackDto.lyric = track.lyric;
      createTrackDto.image_url = track.cover_img;
      createTrackDto.url_media = track.url_media;
      createTrackDto.album_order_position = 0;
      createTrackDto.isPlayable = true;
      createTrackDto.isExplicit = true;
      createTrackDto.release_date = new Date();
      createTrackDto.artist = artistsForIdMongo[artists[0]];

      const newTrack = await this.create(createTrackDto);
      if (!newTrack) throw new BadRequestException(CREATE_FAIL);

      newTrack.save();

      // if album exist
      if (albums[artists[0]]) {
        let albumId = albumsForIdMongo[albums[artists[0]]];
        newTrack.album = albumId;

        await this.albumService.addTrack(albumId, newTrack._id);
      }

      // create track artist
      for (const artist of artists) {
        const createTrackArtistDto = new CreateTrackArtistDto();
        createTrackArtistDto.track = newTrack._id.toString();
        createTrackArtistDto.artist = artistsForIdMongo[artist];

        const newTrackArtist = await this.trackArtistService.create(createTrackArtistDto);

        newTrackArtist.save();

        // add track artist to track
        await this.addTrackArtist(
          newTrack._id.toString(),
          newTrackArtist._id
        );
      }

      listTrack.push(newTrack);
    }

    return listTrack;
  }

  findAll() {
    return `This action returns all tracks`;
  }

  async findOne(id: string) {
    const foundTrack = await this.trackModel
                              .findById(id)
                              .populate('album')
                              .populate('artist')
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

  async addTrackArtist(trackId: string, trackArtistId: Types.ObjectId) {
    const track = await this.trackModel.findByIdAndUpdate(
      trackId,
      { $push: { trackArtists: trackArtistId } },
      { new: true }
    );
    if (!track) throw new BadRequestException(TRACK_NOT_FOUND);

    return track;
  }
}
