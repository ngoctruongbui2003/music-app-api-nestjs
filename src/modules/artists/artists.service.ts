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
    let newArtists = {};

    for (const artist of artists) {
      const images = new ImageDto();
      images.url = 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DvPz8ftK_4bk&psig=AOvVaw25Wlb7ubkLbxo1gYfvzrK5&ust=1731639430259000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCLi83drp2okDFQAAAAAdAAAAABAE';
      images.isCover = true;

      const createArtistDto = new CreateArtistDto();
      createArtistDto.name = artist;
      createArtistDto.avatarUrl = 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fthanhnien.vn%2Fdanh-doi-hanh-trinh-truong-thanh-cua-rapper-obito-185231012110144312.htm&psig=AOvVaw2o2daCfEBqXV_-4Ow-_tiV&ust=1731639239085000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCOCq18rp2okDFQAAAAAdAAAAABAE';
      createArtistDto.images = [images];
      createArtistDto.genres = ['pop'];
      createArtistDto.type = ['artist'];

      const newArtist = await this.create(createArtistDto);
      if (!newArtist) throw new BadRequestException(CREATE_FAIL);

      newArtists[newArtist.name] = newArtist._id;
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
