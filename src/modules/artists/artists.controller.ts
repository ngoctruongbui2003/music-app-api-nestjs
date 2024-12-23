import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { CreateArtistDto, FindArtistDto, PaginationArtistDto, UpdateArtistDto } from './dto';
import { CREATE_SUCCESS, DELETE_SUCCESS, GET_ALL_SUCCESS, GET_SUCCESS, UPDATE_SUCCESS } from 'src/constants/server';

@Controller('artists')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createArtistDto: CreateArtistDto) {
    return {
      message: CREATE_SUCCESS,
      data: await this.artistsService.create(createArtistDto)
    };
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async findAll(@Body() paginationDto: PaginationArtistDto) {

    return {
      message: GET_ALL_SUCCESS,
      data: await this.artistsService.findAll(paginationDto) 
    };
  }

  @Post(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id') id: string,
    @Body() findArtistDto: FindArtistDto
  ) {
    return {
      message: GET_SUCCESS,
      data: await this.artistsService.findOne(id, findArtistDto)
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateArtistDto: UpdateArtistDto) {
    return {
      message: UPDATE_SUCCESS,
      data: await this.artistsService.update(id, updateArtistDto)
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return {
      message: DELETE_SUCCESS,
      data: await this.artistsService.remove(id)
    };
  }
}
