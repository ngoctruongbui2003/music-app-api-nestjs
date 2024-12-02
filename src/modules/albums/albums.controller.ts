import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto, FindAlbumDto, PaginationAlbumDto, UpdateAlbumDto } from './dto';
import { CREATE_SUCCESS, DELETE_SUCCESS, GET_ALL_SUCCESS, GET_SUCCESS, UPDATE_SUCCESS } from 'src/constants/server';

@Controller('albums')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Post('create')
  async create(@Body() createAlbumDto: CreateAlbumDto) {
    return {
      message: CREATE_SUCCESS,
      data: await this.albumsService.create(createAlbumDto)
    }
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async findAll(@Body() paginationAlbumDto: PaginationAlbumDto) {
    return {
      message: GET_ALL_SUCCESS,
      data: await this.albumsService.findAll(paginationAlbumDto)
    };
  }

  @Post(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id') id: string,
    @Body() findAlbumDto: FindAlbumDto
  ) {
    return {
      message: GET_SUCCESS,
      data: await this.albumsService.findOne(id, findAlbumDto)
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateAlbumDto: UpdateAlbumDto) {
    return {
      message: UPDATE_SUCCESS,
      data: await this.albumsService.update(id, updateAlbumDto)
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return {
      message: DELETE_SUCCESS,
      data: await this.albumsService.remove(id)
    };
  }

  @Post('artist/:artistId')
  @HttpCode(HttpStatus.OK)
  async getAlbumsByArtist(
    @Param('artistId') artistId: string,
    @Body() paginationAlbumDto: PaginationAlbumDto
  ) {
    return {
      message: GET_SUCCESS,
      data: await this.albumsService.getAlbumsByArtist(artistId, paginationAlbumDto),
    }
  }

  @Post('single-album/artist/:artistId')
  @HttpCode(HttpStatus.OK)
  async getSingleAlbumsByArtist(
    @Param('artistId') artistId: string,
    @Body() paginationAlbumDto: PaginationAlbumDto
  ) {
    return {
      message: GET_SUCCESS,
      data: await this.albumsService.getSingleAlbumsByArtist(artistId, paginationAlbumDto),
    }
  }

  @Post('latest/artist/:artistId')
  @HttpCode(HttpStatus.OK)
  async getLatestAlbumByArtist(
    @Param('artistId') artistId: string,
    @Body() findAlbumDto: FindAlbumDto
  ) {
    return {
      message: GET_SUCCESS,
      data: await this.albumsService.getLatestAlbumByArtist(artistId, findAlbumDto),
    }
  }
}
