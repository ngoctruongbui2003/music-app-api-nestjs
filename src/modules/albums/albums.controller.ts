import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto, FindAlbumDto, UpdateAlbumDto } from './dto';
import { CREATE_SUCCESS, DELETE_SUCCESS, GET_ALL_SUCCESS, GET_SUCCESS, UPDATE_SUCCESS } from 'src/constants/server';

@Controller('albums')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Post()
  async create(@Body() createAlbumDto: CreateAlbumDto) {
    return {
      message: CREATE_SUCCESS,
      data: await this.albumsService.create(createAlbumDto)
    }
  }

  @Post('/available')
  async createAvailable() {
    return {
      message: CREATE_SUCCESS,
      data: await this.albumsService.createAvailable()
    }
  }

  @Get()
  async findAll(@Body() findAlbumDto: FindAlbumDto = new FindAlbumDto()) {
    return {
      message: GET_ALL_SUCCESS,
      data: await this.albumsService.findAll(findAlbumDto)
    };
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Body() findAlbumDto: FindAlbumDto = new FindAlbumDto()
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
}
