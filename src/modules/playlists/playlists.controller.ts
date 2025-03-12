// playlist.controller.ts
import { Controller, Post, Get, Body, Param, Request, UseGuards } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AddTracksDto, CreatePlaylistDto } from './dto';
import { CREATE_SUCCESS, GET_SUCCESS } from 'src/constants/server';

@Controller('playlists')
export class PlaylistsController {
  constructor(private readonly playlistService: PlaylistsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() createPlaylistDto: CreatePlaylistDto) {
    return {
      message: CREATE_SUCCESS,
      data: await this.playlistService.create(req.user.id, createPlaylistDto)
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findByUser(@Request() req) {
    return {
      message: GET_SUCCESS,
      data: await this.playlistService.findByUser(req.user.id)
    };
  }

  // @UseGuards(JwtAuthGuard)
  // @Post('save')
  // async savePlaylistToLibrary(@Request() req, @Body() savePlaylistDto: SavePlaylistDto) {
  //   return this.playlistService.savePlaylistToLibrary(req.user.userId, savePlaylistDto);
  // }

  @UseGuards(JwtAuthGuard)
  @Post('add-track')
  async addTrackToPlaylist(@Request() req, @Body() addTracksDto: AddTracksDto) {
    return {
      message: CREATE_SUCCESS,
      data: await this.playlistService.addTrackToPlaylist(req.user.id, addTracksDto)
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('remove-track')
  async removeTrackFromPlaylist(@Request() req, @Body() addTracksDto: AddTracksDto) {
    return {
      message: CREATE_SUCCESS,
      data: await this.playlistService.removeTrackFromPlaylist(req.user.id, addTracksDto)
    };
  }

  // @UseGuards(JwtAuthGuard)
  // @Post('add-album')
  // async addAlbumToPlaylist(@Body() addAlbumDto: AddAlbumDto) {
  //   return this.playlistService.addAlbumToPlaylist(addAlbumDto);
  // }
}