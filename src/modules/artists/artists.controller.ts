import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { CreateArtistDto, UpdateArtistDto } from './dto';
import { CREATE_SUCCESS, DELETE_SUCCESS, GET_ALL_SUCCESS, GET_SUCCESS, UPDATE_SUCCESS } from 'src/constants/server';

@Controller('artists')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Post()
  async create(@Body() createArtistDto: CreateArtistDto) {
    return {
      message: CREATE_SUCCESS,
      data: await this.artistsService.create(createArtistDto)
    };
  }

  @Post('/available')
  async createAvailable() {
    return {
      message: CREATE_SUCCESS,
      data: await this.artistsService.createAvailable() 
    };
  }

  @Get()
  async findAll() {
    return {
      message: GET_ALL_SUCCESS,
      data: await this.artistsService.findAll() 
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return {
      message: GET_SUCCESS,
      data: await this.artistsService.findOne(+id)
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateArtistDto: UpdateArtistDto) {
    return {
      message: UPDATE_SUCCESS,
      data: await this.artistsService.update(+id, updateArtistDto)
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return {
      message: DELETE_SUCCESS,
      data: await this.artistsService.remove(+id)
    };
  }
}
