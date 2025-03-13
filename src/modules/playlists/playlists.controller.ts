// playlist.controller.ts
import { Controller, Post, Get, Body, Param, Request, UseGuards, HttpCode, HttpStatus, Patch } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AddAlbumDto, AddPlaylistDto, AddTrackDto, AddTracksDto, CreatePlaylistDto } from './dto';
import { ADD_SUCCESS, CREATE_SUCCESS, GET_SUCCESS } from 'src/constants/server';

@Controller('playlists')
export class PlaylistsController {
  constructor(private readonly playlistService: PlaylistsService) {}

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
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
  @HttpCode(HttpStatus.OK)
  @Post('add-track')
  async addTrackToPlaylist(@Request() req, @Body() addTracksDto: AddTrackDto) {
    return {
      message: CREATE_SUCCESS,
      data: await this.playlistService.addTrackToPlaylist(req.user.id, addTracksDto)
    };
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('add-tracks-from-album')
  async addTracksFromAlbumToPlaylist(@Request() req, @Body() addAlbumDto: AddAlbumDto) {
    return {
      message: ADD_SUCCESS,
      data: await this.playlistService.addAlbumToPlaylist(req.user.id, addAlbumDto)
    };
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('add-tracks-from-playlist')
  async addTracksFromPlaylistToPlaylist(@Request() req, @Body() addPlaylistDto: AddPlaylistDto) {
    return {
      message: ADD_SUCCESS,
      data: await this.playlistService.addPlaylistToPlaylist(req.user.id, addPlaylistDto)
    };
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('remove-track')
  async removeTrackFromPlaylist(@Request() req, @Body() addTracksDto: AddTrackDto) {
    return {
      message: CREATE_SUCCESS,
      data: await this.playlistService.removeTrackFromPlaylist(req.user.id, addTracksDto)
    };
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Patch(':playlistId/public')
  async togglePlaylistPublic(@Request() req, @Param('playlistId') playlistId: string) {
    return {
      message: CREATE_SUCCESS,
      data: await this.playlistService.togglePlaylistVisibility(req.user.id, playlistId, true)
    };
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Patch(':playlistId/private')
  async togglePlaylistPrivate(@Request() req, @Param('playlistId') playlistId: string) {
    return {
      message: CREATE_SUCCESS,
      data: await this.playlistService.togglePlaylistVisibility(req.user.id, playlistId, false)
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('count')
  async getUserPlaylistCount(@Request() req) {
    return {
      message: GET_SUCCESS,
      data: await this.playlistService.getNumberOfPlaylistsByUser(req.user.id),
    };
  }

  // @UseGuards(JwtAuthGuard)
  // @Post('add-album')
  // async addAlbumToPlaylist(@Body() addAlbumDto: AddAlbumDto) {
  //   return this.playlistService.addAlbumToPlaylist(addAlbumDto);
  // }
}