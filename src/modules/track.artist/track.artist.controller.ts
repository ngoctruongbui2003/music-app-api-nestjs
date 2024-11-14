import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TrackArtistService } from './track.artist.service';
import { CreateTrackArtistDto, UpdateTrackArtistDto } from './dto';

@Controller('track.artist')
export class TrackArtistController {
  constructor(private readonly trackArtistService: TrackArtistService) {}

  @Post()
  create(@Body() createTrackArtistDto: CreateTrackArtistDto) {
    return this.trackArtistService.create(createTrackArtistDto);
  }

  @Get()
  findAll() {
    return this.trackArtistService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trackArtistService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTrackArtistDto: UpdateTrackArtistDto) {
    return this.trackArtistService.update(+id, updateTrackArtistDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trackArtistService.remove(+id);
  }
}
