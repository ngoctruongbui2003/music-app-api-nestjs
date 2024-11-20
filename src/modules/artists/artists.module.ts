import { Module } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Artist, ArtistSchema } from 'src/schemas/artist.schema';
import { Album, AlbumSchema } from 'src/schemas/album.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Artist.name, schema: ArtistSchema },
    { name: Album.name, schema: AlbumSchema }
  ])],
  controllers: [ArtistsController],
  providers: [ArtistsService],
  exports: [ArtistsService],
})
export class ArtistsModule {}
