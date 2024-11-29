import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { CreateTrackDto, FindTrackDto, PaginationTrackDto, UpdateTrackDto } from './dto';
import { CREATE_SUCCESS, GET_SUCCESS } from 'src/constants/server';

@Controller('tracks')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Post('create')
  async create(@Body() createTrackDto: CreateTrackDto) {
    return {
      message: CREATE_SUCCESS,
      data: await this.tracksService.create(createTrackDto),
    }
  }

  @Post()
  async findAll(@Body() paginationTrackDto: PaginationTrackDto) {
    return {
      message: GET_SUCCESS,
      data: await this.tracksService.findAll(paginationTrackDto),
    };
  }

  @Post(':id')
  async findOne(
    @Param('id') id: string,
    @Body() findTrackDto: FindTrackDto
  ) {
    return {
      message: GET_SUCCESS,
      data: await this.tracksService.findOne(id, findTrackDto),
    }
  }

  @Post('album/:albumId')
  async getTracksByAlbum(
    @Param('albumId') albumId: string,
    @Body() paginationTrackDto: PaginationTrackDto,
  ) {
    return {
      message: GET_SUCCESS,
      data: await this.tracksService.getTracksByAlbum(albumId, paginationTrackDto),
    }
  }

  @Post('artist/:artistId')
  async getTracksByArtist(
    @Param('artistId') artistId: string,
    @Body() paginationTrackDto: PaginationTrackDto,
  ) {
    return {
      message: GET_SUCCESS,
      data: await this.tracksService.getTracksByArtist(artistId, paginationTrackDto),
    }
  }

  @Post('top/artist/:artistId')
  async getTopTracksByArtist(
    @Param('artistId') artistId: string,
    @Body() paginationTrackDto: PaginationTrackDto
  ) {
    return {
      message: GET_SUCCESS,
      data: await this.tracksService.getTopTracksByArtist(artistId, paginationTrackDto),
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTrackDto: UpdateTrackDto) {
    return this.tracksService.update(+id, updateTrackDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return {
      message: GET_SUCCESS,
      data: await this.tracksService.remove(id),
    }
  }
}
