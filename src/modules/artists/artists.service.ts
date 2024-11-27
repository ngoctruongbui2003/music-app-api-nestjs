import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateArtistDto, ImageDto, PaginationDto, UpdateArtistDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { Artist } from 'src/schemas/artist.schema';
import { Model, Types } from 'mongoose';
import { ARTIST_NOT_FOUND, CREATE_FAIL, UPDATE_FAIL } from 'src/constants/server';
import { artists } from 'src/db/fake';
import { convertObjectId, parseSortFields } from 'src/utils';
import { Album } from 'src/schemas/album.schema';

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
      createArtistDto.description = `This is a ${artist} artist`;
      createArtistDto.avatar_url = 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fthanhnien.vn%2Fdanh-doi-hanh-trinh-truong-thanh-cua-rapper-obito-185231012110144312.htm&psig=AOvVaw2o2daCfEBqXV_-4Ow-_tiV&ust=1731639239085000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCOCq18rp2okDFQAAAAAdAAAAABAE';
      createArtistDto.images = [images];
      createArtistDto.genres = ['pop'];
      createArtistDto.type = ['artist'];

      const newArtist = await this.create(createArtistDto);
      if (!newArtist) throw new BadRequestException(CREATE_FAIL);

      newArtists[newArtist.name] = newArtist._id;
    }

    return newArtists;
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit, select, sort } = paginationDto;
    const skip = (page - 1) * limit;
    let sortCriteria;

    const selectFields = select ? select.split(',').join(' ') : '';

    if (sort) {
      sortCriteria = parseSortFields(sort);
    }

    const artists = await this.artistModel
                          .find()
                          .select(selectFields)
                          .skip(skip)
                          .limit(limit)
                          .sort(sort && sortCriteria)
                          .lean();
    
    return {
      page: +page,
      limit: +limit,
      total: await this.artistModel.countDocuments(),
      data: artists,
    };
  }

  async findOne(
    id: string,
  ) {
    const artist = await this.artistModel
                    .findById(id);
    if (!artist) throw new BadRequestException(ARTIST_NOT_FOUND);

    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    const updatedArtist = await this.artistModel.findByIdAndUpdate(id, updateArtistDto, { new: true });
    if (!updatedArtist) throw new BadRequestException(UPDATE_FAIL);

    return updatedArtist;
  }

  async remove(id: string) {
    const deletedArtist = await this.artistModel.findByIdAndDelete(id);

    return deletedArtist;
  }

  async addAlbum(artistId: string, album: Types.ObjectId) {
    const artist = await this.artistModel.findByIdAndUpdate(
      artistId,
      { $push: { albums: album } },
      { new: true }
    );
    if (!artist) throw new BadRequestException(ARTIST_NOT_FOUND);

    return artist;
  }

  async addTrackArtist(artistId: string, trackArtistId: Types.ObjectId) {
    
  }
}
