import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateArtistDto, ImageDto, UpdateArtistDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { Artist } from 'src/schemas/artist.schema';
import { Model } from 'mongoose';
import { CREATE_FAIL } from 'src/constants/server';
import { artists } from 'src/db/fake';

@Injectable()
export class ArtistsService {
  constructor(@InjectModel(Artist.name) private artistModel: Model<Artist>) {}

  async create(createArtistDto: CreateArtistDto) {
    const newArtist = await this.artistModel.create(createArtistDto);
    if (!newArtist) throw new BadRequestException(CREATE_FAIL);

    return newArtist;
  }

  async createAvailable() {
    let newArtists = [];
    for (const artist of artists) {
      const images = new ImageDto();
      images.url = 'https://ngoctruongbui.com/image1.jpg';
      images.isCover = true;

      const createArtistDto = new CreateArtistDto();
      createArtistDto.name = artist;
      createArtistDto.avatarUrl = 'https://ngoctruongbui.com/avatar.jpg';
      createArtistDto.images = [images];
      createArtistDto.genres = ['pop'];
      createArtistDto.type = ['artist'];


      const newArtist = await this.create(createArtistDto);
      if (!newArtist) throw new BadRequestException(CREATE_FAIL);

      newArtists.push(newArtist);
    }

    return newArtists;
  }

  findAll() {
    const artists = this.artistModel.find();

    return artists;
  }

  findOne(id: number) {
    return `This action returns a #${id} artist`;
  }

  update(id: number, updateArtistDto: UpdateArtistDto) {
    return `This action updates a #${id} artist`;
  }

  remove(id: number) {
    return `This action removes a #${id} artist`;
  }
}
