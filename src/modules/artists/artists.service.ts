import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto, FindArtistDto, PaginationArtistDto, UpdateArtistDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { Artist } from 'src/schemas/artist.schema';
import { Model, Types } from 'mongoose';
import { ARTIST_NOT_FOUND, CREATE_FAIL, UPDATE_FAIL } from 'src/constants/server';
import { convertObjectId, parseSortFields } from 'src/utils';

@Injectable()
export class ArtistsService {
  constructor(@InjectModel(Artist.name) private artistModel: Model<Artist>) {}

  async create(createArtistDto: CreateArtistDto) {
    const newArtist = await this.artistModel.create(createArtistDto);
    if (!newArtist) throw new BadRequestException(CREATE_FAIL);

    return newArtist;
  }

  async findAll(paginationDto: PaginationArtistDto) {
    const { page, limit, select, sort } = paginationDto;
    const skip = (page - 1) * limit;
    let sortCriteria;

    if (sort) {
      sortCriteria = parseSortFields(sort);
    }

    const artists = await this.artistModel
                          .find()
                          .select(select)
                          .skip(skip)
                          .limit(limit)
                          .sort(sort && sortCriteria)
                          .lean();
    
    return {
      page: page && +page,
      limit: limit && +limit,
      total: await this.artistModel.countDocuments(),
      data: artists,
    };
  }

  async findOne(
    id: string,
    findArtistDto: FindArtistDto
  ) {
    const { select } = findArtistDto;

    const artist = await this.artistModel
                    .findOne({ _id: convertObjectId(id) })
                    .select(select)
                    .lean();
    if (!artist) throw new NotFoundException(ARTIST_NOT_FOUND);

    return artist;
  }

  async findMany(ids: string[]) {
    const idsArray = ids.map(id => convertObjectId(id));
    const artists = await this.artistModel
    .find({ _id: { $in: idsArray } });

    return artists;
  }

  async isExist(id: string) {
    const artist = await this.artistModel.findById(id);
    if (!artist) return false;
    return true;
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
}
