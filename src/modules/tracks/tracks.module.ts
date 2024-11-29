import { forwardRef, Module } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { TracksController } from './tracks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Track, TrackSchema } from 'src/schemas/track.schema';
import { AlbumsModule } from '../albums/albums.module';
import { ArtistsModule } from '../artists/artists.module';

@Module({
  imports: [
    forwardRef(() => AlbumsModule),
    ArtistsModule,
    MongooseModule.forFeature([{ name: Track.name, schema: TrackSchema }])
  ],
  controllers: [TracksController],
  providers: [TracksService],
  exports: [TracksService]
})
export class TracksModule {}
