import { Module } from '@nestjs/common';
import { TrackPlaylistService } from './track.playlist.service';
import { TrackPlaylistController } from './track.playlist.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TrackPlaylist, TrackPlaylistSchema } from 'src/schemas/track.playlist.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: TrackPlaylist.name, schema: TrackPlaylistSchema }])],
  controllers: [TrackPlaylistController],
  providers: [TrackPlaylistService],
})
export class TrackPlaylistModule {}
