import { Module } from '@nestjs/common';
import { TrackArtistService } from './track.artist.service';
import { TrackArtistController } from './track.artist.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TrackArtist, TrackArtistSchema } from 'src/schemas/track.artist.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: TrackArtist.name, schema: TrackArtistSchema }])],
  controllers: [TrackArtistController],
  providers: [TrackArtistService],
  exports: [TrackArtistService],
})
export class TrackArtistModule {}
