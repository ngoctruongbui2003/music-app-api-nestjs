import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserPlaylistService } from './user.playlist.service';
import { CreateUserPlaylistDto, UpdateUserPlaylistDto } from './dto';

@Controller('user.playlist')
export class UserPlaylistController {
  constructor(private readonly userPlaylistService: UserPlaylistService) {}

  @Post()
  create(@Body() createUserPlaylistDto: CreateUserPlaylistDto) {
    return this.userPlaylistService.create(createUserPlaylistDto);
  }

  @Get()
  findAll() {
    return this.userPlaylistService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userPlaylistService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserPlaylistDto: UpdateUserPlaylistDto) {
    return this.userPlaylistService.update(+id, updateUserPlaylistDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userPlaylistService.remove(+id);
  }
}
