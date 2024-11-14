import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { CreateTrackDto, UpdateTrackDto } from './dto';
import { CREATE_SUCCESS, GET_SUCCESS } from 'src/constants/server';

@Controller('tracks')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Post()
  async create(@Body() createTrackDto: CreateTrackDto) {
    return {
      message: CREATE_SUCCESS,
      data: await this.tracksService.create(createTrackDto),
    }
  }

  @Post("/available")
  async createAvailable() {
    return {
      message: CREATE_SUCCESS,
      data: await this.tracksService.createAvailable(),
    }
  }

  @Get()
  async findAll() {
    return this.tracksService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return {
      message: GET_SUCCESS,
      data: await this.tracksService.findOne(id),
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTrackDto: UpdateTrackDto) {
    return this.tracksService.update(+id, updateTrackDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tracksService.remove(+id);
  }
}
