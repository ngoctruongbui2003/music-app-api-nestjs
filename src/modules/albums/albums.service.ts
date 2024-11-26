import { artists } from './../../db/fake';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAlbumDto, FindAlbumDto, UpdateAlbumDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { Album } from 'src/schemas/album.schema';
import { Model, Types } from 'mongoose';
import { ALBUM_NOT_FOUND, ARTIST_NOT_FOUND, CREATE_FAIL, UPDATE_FAIL } from 'src/constants/server';
import { albums, artistsForIdMongo } from 'src/db/fake';
import { convertObjectId, getInfoData } from 'src/utils';
import { ArtistsService } from '../artists/artists.service';
import { find } from 'rxjs';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectModel(Album.name) private albumModel: Model<Album>,
    private readonly artistsService: ArtistsService,
  ) {}

  async create(createAlbumDto: CreateAlbumDto) {
    // check artist is exist
    const isArtistExist = await this.artistsService.findOne(createAlbumDto.artist);
    if (!isArtistExist) throw new BadRequestException(ARTIST_NOT_FOUND);

    // convert artist to ObjectId
    const artistId = convertObjectId(createAlbumDto.artist);

    // Create new album
    const newAlbum = await this.albumModel.create({
      ...createAlbumDto,
      artist: artistId,
    });
    if (!newAlbum) throw new BadRequestException(CREATE_FAIL);

    newAlbum.save();

    // Add ablum to artist
    await this.artistsService.addAlbum(createAlbumDto.artist, newAlbum._id);

    return newAlbum;
  }

  async createAvailable() {
    let newAlbums = {};

    for (let album in albums) {
      const createAlbumDto = new CreateAlbumDto();
      createAlbumDto.title = albums[album];
      createAlbumDto.image_url = "https://www.google.com/url?sa=i&url=https%3A%2F%2Fopen.spotify.com%2Falbum%2F1wmnEWgcDdCcOujQpLwYxc&psig=AOvVaw2xeX9UF2VAjOv3Du7hm-Ow&ust=1731902027411000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCJjG4vq74okDFQAAAAAdAAAAABAE";
      createAlbumDto.isPlayable = true;
      createAlbumDto.release_date = new Date();
      createAlbumDto.artist = artistsForIdMongo[album];

      const newAlbum = await this.create(createAlbumDto);
      if (!newAlbum) throw new BadRequestException(CREATE_FAIL);

      newAlbums[newAlbum.title] = newAlbum._id;
    }

    return newAlbums;
  }

  async findAll(findAlbumDto: FindAlbumDto) {
    const albums = await this.albumModel
                .find()
                .populate(findAlbumDto.isPopulateArtist ? 'artist' : '')
                .populate(findAlbumDto.isPopulateTrack ? 'tracks' : '')
                .select(findAlbumDto.chosenSelect);
    return albums;
  }

  async findOne(
    id: string,
    findAlbumDto: FindAlbumDto
  ) {
    const album = await this.albumModel
                  .findById(id)
                  .populate(findAlbumDto.isPopulateArtist ? 'artist' : '')
                  .populate(findAlbumDto.isPopulateTrack ? 'tracks' : '')
                  .select(findAlbumDto.chosenSelect);
    if (!album) throw new BadRequestException(ALBUM_NOT_FOUND);

    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const updatedAlbum = await this.albumModel.findByIdAndUpdate(id, updateAlbumDto, { new: true });
    if (!updatedAlbum) throw new BadRequestException(UPDATE_FAIL);

    return updatedAlbum;
  }

  async remove(id: string) {
    const removedAlbum = await this.albumModel.findByIdAndDelete(id);

    return removedAlbum;
  }

  async addTrack(albumId: string, trackId: Types.ObjectId) {
    const track = await this.albumModel.findByIdAndUpdate(
      albumId,
      { $push: { tracks: trackId } },
      { new: true }
    );
    if (!track) throw new BadRequestException(ALBUM_NOT_FOUND);

    return track;
  }
}
