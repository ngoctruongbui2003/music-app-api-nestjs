import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto, FindAlbumDto, PaginationAlbumDto, UpdateAlbumDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { Album } from 'src/schemas/album.schema';
import { Model, Types } from 'mongoose';
import { ALBUM_NOT_FOUND, ARTIST_NOT_FOUND, CREATE_FAIL, UPDATE_FAIL } from 'src/constants/server';
import { convertObjectId } from 'src/utils';
import { ArtistsService } from '../artists/artists.service';
import { AlbumType } from 'src/constants/enum';
import { CreateTrackDto } from '../tracks/dto';
import { TracksService } from '../tracks/tracks.service';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectModel(Album.name) private albumModel: Model<Album>,
    private readonly artistsService: ArtistsService,
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,
  ) {}

  async create(createAlbumDto: CreateAlbumDto) {
    const creatorId = createAlbumDto.creator;
    // check artist is exist
    const isArtistExist = await this.artistsService.isExist(createAlbumDto.creator);
    if (!isArtistExist) throw new NotFoundException(ARTIST_NOT_FOUND);

    // Create new album
    const newAlbum = await this.albumModel.create({
      ...createAlbumDto,
      creator: convertObjectId(creatorId),
    });

    if (!newAlbum) throw new BadRequestException(CREATE_FAIL);
    newAlbum.save();

    return newAlbum;
  }

  async findAll(paginationAlbumDto: PaginationAlbumDto) {
    const { page, limit, sort, select, isPopulateCreator } = paginationAlbumDto;
    const skip = (page - 1) * limit;

    const albums = await this.albumModel
                .find()
                .select(select)
                .populate(isPopulateCreator ? 'creator' : '')
                .sort(sort)
                .skip(skip)
                .limit(limit);

    return {
      page: page && +page,
      limit: limit && +limit,
      total: await this.albumModel.countDocuments(),
      data: albums,
    };
  }

  async findOne(
    id: string,
    findAlbumDto: FindAlbumDto
  ) {
    const { select, isPopulateCreator } = findAlbumDto;
    const album = await this.albumModel
                .findOne({ _id: convertObjectId(id) })
                .select(select)
                .populate(isPopulateCreator ? 'creator' : '');
    if (!album) throw new NotFoundException(ALBUM_NOT_FOUND);

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
    const album = await this.albumModel.findByIdAndUpdate(
      albumId,
      {
        $push: { tracks: trackId },
        $inc: { total_tracks: 1 }
      },
      { new: true }
    );
    if (!album) throw new BadRequestException(ALBUM_NOT_FOUND);

    return album;
  }

  async createAlbumSingleToTrack(createTrackDto: CreateTrackDto) {
    // create album single
    const createAlbumDto = new CreateAlbumDto();
    createAlbumDto.title = createTrackDto.title + ' - Single';
    createAlbumDto.image_url = createTrackDto.image_url;
    createAlbumDto.isPlayable = true;
    createAlbumDto.release_date = new Date();
    createAlbumDto.type = AlbumType.SINGLE;
    createAlbumDto.creator = createTrackDto.creator;

    const newAlbum = await this.albumModel.create(createAlbumDto);
    newAlbum.save();

    return newAlbum;
  }

  async getAlbumsByArtist(artistId: string, paginationAlbumDto: PaginationAlbumDto) {
    const { page, limit, sort, select, isPopulateCreator } = paginationAlbumDto;
    const skip = (page - 1) * limit;

    const albums = await this.albumModel
                  .find({ creator: convertObjectId(artistId), type: AlbumType.ALBUM })
                  .select(select)
                  .populate(isPopulateCreator ? 'creator' : '')
                  .sort(sort)
                  .skip(skip)
                  .limit(limit);

    return {
      page: page && +page,
      limit: limit && +limit,
      data: albums,
    };
  }

  async getSingleAlbumsByArtist(artistId: string, paginationAlbumDto: PaginationAlbumDto) {
    const { page, limit, sort, select, isPopulateCreator } = paginationAlbumDto;
    const skip = (page - 1) * limit;

    const tracks = await this.tracksService.getTracksByArtist(artistId, {});
    const albumIds = tracks.map(track => track.album).filter(id => id);
    const uniqueAlbumIds = [...new Set(albumIds)];
    const singleAlbums = await this.albumModel
                  .find({
                    _id: { $in: uniqueAlbumIds },
                    type: AlbumType.SINGLE,
                  })
                  .select(select)
                  .populate(isPopulateCreator ? 'creator' : '')
                  .sort(sort)
                  .skip(skip)
                  .limit(limit);
    

    return {
      page: page && +page,
      limit: limit && +limit,
      data: singleAlbums,
    };
  }

  async getLatestAlbumByArtist(artistId: string, findAlbumDto: FindAlbumDto
  ) {
    const { select, isPopulateCreator } = findAlbumDto;


    const latestTrack = await this.tracksService.getLatestTrackByArtist(artistId);
    const lastestAlbumId = latestTrack.album.toString();
    const latestAlbum = await this.albumModel
                          .findOne({ _id: lastestAlbumId })
                          .select(select)
                          .populate(isPopulateCreator ? 'creator' : '');
    return latestAlbum;
  }

  async isSingleAlbum(albumId: string) {
    const album = await this.albumModel.findOne({ _id: albumId });
    if (!album) throw new NotFoundException(ALBUM_NOT_FOUND);

    return album.type === AlbumType.SINGLE;
  }
}
