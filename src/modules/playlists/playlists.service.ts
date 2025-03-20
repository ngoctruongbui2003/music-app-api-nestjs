import { TracksService } from './../tracks/tracks.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AddAlbumDto, AddTrackDto, AddTracksDto, CreatePlaylistDto, AddPlaylistDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { Playlist } from 'src/schemas/playlist.schema';
import { Model } from 'mongoose';
import { UserLibrary } from 'src/schemas/user-library.schema';
import { convertObjectId } from 'src/utils';
import { ALBUM_NOT_FOUND, PLAYLIST_NOT_FOUND, TRACK_NOT_FOUND } from 'src/constants/server';
import { AlbumsService } from '../albums/albums.service';

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectModel(Playlist.name) private playlistModel: Model<Playlist>,
    @InjectModel(UserLibrary.name) private userLibraryModel: Model<UserLibrary>,
    private readonly tracksService: TracksService,
    private readonly albumsService: AlbumsService
  ) {}

  async create(userId: string, createPlaylistDto: CreatePlaylistDto) {
    return await this.playlistModel.create({
      ...createPlaylistDto,
      createdBy: convertObjectId(userId),
      tracks: []
    });
  }

  async findByUser(userId: string) {
    const foundPlaylist = await this.playlistModel
                                .find({ createdBy: convertObjectId(userId) })
    return {
      total: foundPlaylist.length,
      data: foundPlaylist
    };
  }

  async findOne(playlistId: string) {
    return await this.playlistModel.findById(playlistId);
  }
  
  async getTracksInPlaylist(playlistId: string) {
    // Check if playlist exists
    const playlist = await this.playlistModel.findById(playlistId).populate('tracks.track');
    if (!playlist) throw new BadRequestException(PLAYLIST_NOT_FOUND);

    return playlist.tracks;
  }

  async addTrackToPlaylist(userId: string, addTracksDto: AddTrackDto) {
    const { trackId, playlistId } = addTracksDto;

    // 1. Check if track exists
    const track = await this.tracksService.findOne(trackId);
    if (!track) throw new BadRequestException(TRACK_NOT_FOUND);

    // 2. Check if playlist exists
    const playlist = await this.playlistModel.findById(playlistId);
    if (!playlist) throw new BadRequestException(PLAYLIST_NOT_FOUND);

    // 3. Check created by is the same as the user
    const isSameCreator = playlist.createdBy.toString() === userId;
    if (!isSameCreator) throw new BadRequestException('You are not allowed to add tracks to this playlist');

    // 4. Check if the track is already in the playlist
    const isTrackExist = playlist.tracks.some(track => track.track.toString() === trackId);
    if (isTrackExist) throw new BadRequestException('Track is already in the playlist');
  
    // 5. Get new position for the added track
    const newPosition = playlist.tracks.length > 0 
      ? Math.max(...playlist.tracks.map(track => track.position)) + 1
      : 0;
  
    const newTrack = {
      track: trackId,
      position: newPosition,
    };
  
    return await this.playlistModel.findByIdAndUpdate(
      playlistId,
      { $push: { tracks: newTrack } },
      { new: true }
    );
  }

  async addAlbumToPlaylist(userId: string, addAlbumDto: AddAlbumDto) {
    const { albumId, playlistId } = addAlbumDto;

    // 1. Check if playlist exists
    const playlist = await this.playlistModel.findById(playlistId);
    if (!playlist) throw new BadRequestException(PLAYLIST_NOT_FOUND);

    // 2. Check created by is the same as the user
    const isSameCreator = playlist.createdBy.toString() === userId;
    if (!isSameCreator) throw new BadRequestException('You are not allowed to add tracks to this playlist');

    // 3. Check if album exists
    const album = await this.albumsService.findOne(albumId);
    if (!album) throw new BadRequestException(ALBUM_NOT_FOUND);

    // 4. Get album tracks
    const { data } = await this.tracksService.getTracksByAlbum(albumId);
    const trackIds = data.map(track => track._id.toString());

    // 5. Add tracks to the playlist
    return await this.addTracksToPlaylist({ trackIds, playlistId });
  }

  async addPlaylistToPlaylist(userId: string, addPlaylistDto: AddPlaylistDto) {
    const { playlistId, otherPlaylistId } = addPlaylistDto;

    // 1. Check if playlist exists
    const playlist = await this.playlistModel.findById(playlistId);
    if (!playlist) throw new BadRequestException(PLAYLIST_NOT_FOUND);

    // 2. Check created by is the same as the user
    const isSameCreator = playlist.createdBy.toString() === userId;
    if (!isSameCreator) throw new BadRequestException('You are not allowed to add tracks to this playlist');

    // 3. Check if remaining playlist exists
    const remainingPlaylist = await this.findOne(otherPlaylistId);
    if (!remainingPlaylist) throw new BadRequestException(PLAYLIST_NOT_FOUND);

    // 4. Check if the remaining playlist is public
    if (!remainingPlaylist.isPublic) throw new BadRequestException('Playlist is private');

    // 5. Get remaining playlist tracks
    const data = await this.getTracksInPlaylist(otherPlaylistId);
    const trackIds = data.map(track => track.track._id.toString());

    // 6. Add tracks to the playlist
    return await this.addTracksToPlaylist({ trackIds, playlistId });
  }

  private async addTracksToPlaylist(addTracksDto: AddTracksDto) {
    const { trackIds, playlistId } = addTracksDto;

    // 1. Check if playlist exists
    const playlist = await this.playlistModel.findById(playlistId);
    if (!playlist) throw new BadRequestException(PLAYLIST_NOT_FOUND);

    // 2. Filter out tracks that are already in the playlist
    const existingTrackIds = playlist.tracks.map(track => track.track.toString());
    const newTrackIds = trackIds.filter(trackId => !existingTrackIds.includes(trackId));

    if (newTrackIds.length === 0) throw new BadRequestException('All tracks are already in the playlist');

    // 3. Get new positions for the added tracks
    const currentMaxPosition = playlist.tracks.length > 0 
      ? Math.max(...playlist.tracks.map(track => track.position)) 
      : -1;

    const newTracks = newTrackIds.map((trackId, index) => ({
      track: trackId,
      position: currentMaxPosition + index + 1,
    }));

    return await this.playlistModel.findByIdAndUpdate(
      playlistId,
      { $push: { tracks: { $each: newTracks } } },
      { new: true }
    );
  }

  async removeTrackFromPlaylist(userId: string, addTracksDto: AddTrackDto) {
    const { trackId, playlistId } = addTracksDto;

    // 1. Check if playlist exists
    const playlist = await this.playlistModel.findById(playlistId);
    if (!playlist) throw new BadRequestException(PLAYLIST_NOT_FOUND);

    // 2. Check created by is the same as the user
    const isSameCreator = playlist.createdBy.toString() === userId;
    if (!isSameCreator) throw new BadRequestException('You are not allowed to remove tracks from this playlist');

    // 3. Check if the track is in the playlist
    const trackIndex = playlist.tracks.findIndex(track => track.track.toString() === trackId);
    if (trackIndex === -1) throw new BadRequestException('Track is not in the playlist');

    // 4. Remove the track from the playlist
    playlist.tracks.splice(trackIndex, 1);

    // 5. Update positions of remaining tracks
    playlist.tracks = playlist.tracks.map((track, index) => ({
      ...track,
      position: index < trackIndex ? track.position : track.position - 1,
    }));

    return await playlist.save();
  }

  async togglePlaylistVisibility(userId: string, playlistId: string, isPublic: boolean) {
    // 1. Check if playlist exists
    const playlist = await this.playlistModel.findById(playlistId);
    if (!playlist) throw new BadRequestException(PLAYLIST_NOT_FOUND);

    // 2. Check created by is the same as the user
    const isSameCreator = playlist.createdBy.toString() === userId;
    if (!isSameCreator) throw new BadRequestException('You are not allowed to change the visibility of this playlist');

    // 3. Toggle the visibility
    playlist.isPublic = isPublic;

    return await playlist.save();
  }

  async getNumberOfPlaylistsByUser(userId: string) {
    const count = await this.playlistModel.countDocuments({ createdBy: convertObjectId(userId) });
    return { count };
  }

  async deletePlaylist(userId: string, playlistId: string) {
    // 1. Check if playlist exists
    const playlist = await this.playlistModel.findById(playlistId);
    if (!playlist) throw new BadRequestException(PLAYLIST_NOT_FOUND);

    // 2. Check created by is the same as the user
    const isSameCreator = playlist.createdBy.toString() === userId;
    if (!isSameCreator) throw new BadRequestException('You are not allowed to delete this playlist');

    // 3. Delete the playlist
    return await this.playlistModel.findByIdAndDelete(playlistId);
  }
}
