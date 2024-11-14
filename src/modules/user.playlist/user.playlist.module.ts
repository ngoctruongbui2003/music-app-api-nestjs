import { Module } from '@nestjs/common';
import { UserPlaylistService } from './user.playlist.service';
import { UserPlaylistController } from './user.playlist.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserPlaylist, UserPlaylistSchema } from 'src/schemas/user.playlist.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: UserPlaylist.name, schema: UserPlaylistSchema }])],
  controllers: [UserPlaylistController],
  providers: [UserPlaylistService],
})
export class UserPlaylistModule {}
