import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto, FindTrackDto, PaginationTrackDto, UpdateTrackDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { Track } from 'src/schemas/track.schema';
import { Model, Types } from 'mongoose';
import { CREATE_FAIL, TRACK_NOT_FOUND } from 'src/constants/server';
import { Genre } from 'src/constants/enum';
import { AlbumsService } from '../albums/albums.service';
import { parseSelectFields } from 'src/utils';
import { ArtistsService } from '../artists/artists.service';

@Injectable()
export class TracksService {
  constructor(
    @InjectModel(Track.name) private trackModel: Model<Track>,
    @Inject(forwardRef(() => AlbumsService)) private readonly albumService: AlbumsService,
    private readonly artistService: ArtistsService
  ) {}

  async create(createTrackDto: CreateTrackDto) {
    const newTrack = await this.trackModel.create(createTrackDto);
    if (!newTrack) throw new BadRequestException(CREATE_FAIL);

    return newTrack;
  }


  async createTrackWithAlbumSingle(createTrackDto: CreateTrackDto) {
    const newAlbum = await this.albumService.createAlbumSingleToTrack(createTrackDto);
    createTrackDto.album = newAlbum._id.toString();

    const newTrack = await this.create(createTrackDto);
    if (!newTrack) throw new BadRequestException(CREATE_FAIL);

    await this.albumService.addTrack(newAlbum._id.toString(), newTrack._id);

    return newTrack;
  }

  async findAll(paginationTrackDto: PaginationTrackDto) {
    const { page, limit, sort, select, isPopulateAlbum, isPopulateCreator } = paginationTrackDto;
    const skip = (page - 1) * limit;

    const tracks = await this.trackModel
                .find()
                .select(select)
                .populate(isPopulateAlbum ? 'album' : '')
                .populate(isPopulateCreator ? 'creator' : '')
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean();

    return {
      page: page && +page,
      limit: limit && +limit,
      total: await this.trackModel.countDocuments(),
      data: tracks,
    };
  }

  async findOne(id: string, findTrackDto: FindTrackDto) {
    const { select, isPopulateAlbum, isPopulateCreator, isPopulateCollaborators } = findTrackDto;
    let newSelect = select;
    if (isPopulateCollaborators) {
      newSelect = newSelect + ' collaborators';
    }

    const foundTrack = await this.trackModel
                              .findById(id)
                              .select(newSelect)
                              .populate(isPopulateAlbum ? 'album' : '')
                              .populate(isPopulateCreator ? 'creator' : '')
                              .lean();
    
    if (!foundTrack) throw new NotFoundException(TRACK_NOT_FOUND);

    let trackJSON = JSON.parse(JSON.stringify(foundTrack));

    if (isPopulateCollaborators) {
      trackJSON = await this.populateCollaborators(trackJSON);
    }
    return trackJSON;
  }

  async getTracksByCreator(artistId: string) {
    const tracks = await this.trackModel
                .find({
                  creator: artistId,
                })
                .lean();
    
    return tracks;
  }

  async getTracksByArtist(artistId: string, paginationTrackDto: PaginationTrackDto) {
    const { page, limit, sort, select, isPopulateAlbum, isPopulateCreator, isPopulateCollaborators } = paginationTrackDto;
    const skip = (page - 1) * limit;
    let newSelect = select;
    if (isPopulateCollaborators) {
      newSelect = newSelect + ' collaborators';
    }

    const tracks = await this.trackModel
                .find({
                  collaborators: artistId,
                })
                .select(newSelect)
                .populate(isPopulateAlbum ? 'album' : '')
                .populate(isPopulateCreator ? 'creator' : '')
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean();
    
    let tracksJSON = JSON.parse(JSON.stringify(tracks));

    if (isPopulateCollaborators) {
      tracksJSON = await this.populateCollaboratorsByMany(tracksJSON);
    }
    
    return tracksJSON;
  }

  async getTopTracksByArtist(artistId: string, paginationTrackDto: PaginationTrackDto) {
    const { page, limit, select, isPopulateAlbum, isPopulateCreator, isPopulateCollaborators } = paginationTrackDto;
    const skip = (page - 1) * limit;
    let newSelect = select;
    if (isPopulateCollaborators) {
      newSelect = select + ' collaborators';
    }

    const tracks = await this.trackModel
                .find({
                  collaborators: artistId,
                })
                .select(newSelect)
                .populate(isPopulateAlbum ? 'album' : '')
                .populate(isPopulateCreator ? 'creator' : '')
                .sort({
                  total_play: -1,
                })
                .skip(skip)
                .limit(limit)
                .lean();

    let tracksJSON = JSON.parse(JSON.stringify(tracks));

    if (isPopulateCollaborators) {
      tracksJSON = await this.populateCollaboratorsByMany(tracksJSON);
    }

    return {
      page: page && +page,
      limit: limit && +limit,
      data: tracksJSON
    };
  }

  async getLatestTrackByArtist(artistId: string) {
    const latestTrack = await this.trackModel
                .find({
                  $or: [
                      { creator: artistId },
                      { collaborators: artistId }
                  ]
                })
                .sort({ release_date: -1 })
                .limit(1);
    
    if (!latestTrack) throw new NotFoundException(TRACK_NOT_FOUND);
    
    return latestTrack[0];
  }

  async getTracksByAlbum(albumId: string, paginationTrackDto: PaginationTrackDto) {
    const { page, limit, sort, select, isPopulateAlbum, isPopulateCreator, isPopulateCollaborators } = paginationTrackDto;
    const skip = (page - 1) * limit;
    let newSelect = select + " album_order_position";
    if (isPopulateCollaborators) {
      newSelect = newSelect + ' collaborators';
    }

    const tracks = await this.trackModel
                .find({
                  album: albumId,
                })
                .select(newSelect)
                .populate(isPopulateAlbum ? 'album' : '')
                .populate(isPopulateCreator ? 'creator' : '')
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean();

    let tracksJSON = JSON.parse(JSON.stringify(tracks));

    if (isPopulateCollaborators) {
      tracksJSON = await this.populateCollaboratorsByMany(tracksJSON);
    }

    return {
      page: page && +page,
      limit: limit && +limit,
      data: tracksJSON
    };
  }

  async populateCollaboratorsByMany(tracks: any) {
    const collaboratorIds = tracks.flatMap(track => track.collaborators);
    const collaborators = await this.artistService.findMany(collaboratorIds)
    const collaboratorMap = new Map(
      collaborators.map(collaborator => [collaborator._id.toString(), collaborator.name])
    );
    tracks.forEach(track => {
      track.collaborators = track.collaborators.map(collaboratorId => ({
        id: collaboratorId.toString(),
        name: collaboratorMap.get(collaboratorId.toString()) || 'Unknown',
      }));
    });

    return tracks;
  }

  async populateCollaborators(track: any) {
    const collaboratorIds = track.collaborators;
    const collaborators = await this.artistService.findMany(collaboratorIds)
    const collaboratorMap = new Map(
      collaborators.map(collaborator => [collaborator._id.toString(), collaborator.name])
    );
    track.collaborators = track.collaborators.map(collaboratorId => ({
      id: collaboratorId.toString(),
      name: collaboratorMap.get(collaboratorId.toString()) || 'Unknown',
    }));

    return track;
  }

  async update(id: number, updateTrackDto: UpdateTrackDto) {
    return `This action updates a #${id} track`;
  }

  async remove(id: string) {
    const deletedTrack = await this.trackModel.findByIdAndDelete(id);
    if (!deletedTrack) throw new NotFoundException(TRACK_NOT_FOUND);

    return deletedTrack;
  }
}
