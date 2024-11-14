import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TrackPlaylistService } from './track.playlist.service';
import { CreateTrackPlaylistDto, UpdateTrackPlaylistDto } from './dto';

@Controller('track.playlist')
export class TrackPlaylistController {
  constructor(private readonly trackPlaylistService: TrackPlaylistService) {}

  @Post()
  create(@Body() createTrackPlaylistDto: CreateTrackPlaylistDto) {
    return this.trackPlaylistService.create(createTrackPlaylistDto);
  }

  @Get()
  findAll() {
    return this.trackPlaylistService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trackPlaylistService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTrackPlaylistDto: UpdateTrackPlaylistDto) {
    return this.trackPlaylistService.update(+id, updateTrackPlaylistDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trackPlaylistService.remove(+id);
  }
}
