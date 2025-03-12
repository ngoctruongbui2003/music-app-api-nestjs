import { TracksService } from './../tracks/tracks.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AddTracksDto, CreatePlaylistDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { Playlist } from 'src/schemas/playlist.schema';
import { Model } from 'mongoose';
import { UserLibrary } from 'src/schemas/user-library.schema';
import { convertObjectId } from 'src/utils';
import { PLAYLIST_NOT_FOUND, TRACK_NOT_FOUND } from 'src/constants/server';

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectModel(Playlist.name) private playlistModel: Model<Playlist>,
    @InjectModel(UserLibrary.name) private userLibraryModel: Model<UserLibrary>,
    private readonly tracksService: TracksService
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

  // async savePlaylistToLibrary(userId: string, savePlaylistDto: SavePlaylistDto) {
  //   let userLibrary = await this.userLibraryModel.findOne({ user: userId });
  //   if (!userLibrary) {
  //     userLibrary = await this.userLibraryModel.create({ user: userId, savedPlaylists: [] });
  //   }
  //   if (!userLibrary.savedPlaylists.includes(savePlaylistDto.playlistId)) {
  //     userLibrary.savedPlaylists.push(savePlaylistDto.playlistId);
  //     await userLibrary.save();
  //   }
  //   return userLibrary;
  // }

  async addTrackToPlaylist(userId: string, addTracksDto: AddTracksDto) {
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

  async removeTrackFromPlaylist(userId: string, addTracksDto: AddTracksDto) {
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

  // async addAlbumToPlaylist(addAlbumDto: AddAlbumDto) {
  //   const albumTracks = await this.trackModel.find({ album: addAlbumDto.albumId }).select('_id');
  //   const formattedTracks = albumTracks.map((track, index) => ({ track: track._id, position: index + 1 }));
  //   return this.playlistModel.findByIdAndUpdate(
  //     addAlbumDto.playlistId,
  //     { $push: { tracks: { $each: formattedTracks, $sort: { position: 1 } } } },
  //     { new: true }
  //   ).populate('tracks.track');
  // }
}
