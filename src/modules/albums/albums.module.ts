import { Module } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { AlbumsController } from './albums.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Album, AlbumSchema } from 'src/schemas/album.schema';
import { ArtistsModule } from '../artists/artists.module';
import { Artist, ArtistSchema } from 'src/schemas/artist.schema';

@Module({
  imports: [
    ArtistsModule,
    MongooseModule.forFeature([
      { name: Album.name, schema: AlbumSchema },
      { name: Artist.name, schema: ArtistSchema },
    ]),
  ],
  controllers: [AlbumsController],
  providers: [AlbumsService],
})
export class AlbumsModule {}
