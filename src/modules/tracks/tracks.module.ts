import { Module } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { TracksController } from './tracks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Track, TrackSchema } from 'src/schemas/track.schema';
import { TrackArtistModule } from '../track.artist/track.artist.module';
import { AlbumsModule } from '../albums/albums.module';

@Module({
  imports: [
    AlbumsModule,
    TrackArtistModule,
    MongooseModule.forFeature([{ name: Track.name, schema: TrackSchema }])
  ],
  controllers: [TracksController],
  providers: [TracksService],
})
export class TracksModule {}
