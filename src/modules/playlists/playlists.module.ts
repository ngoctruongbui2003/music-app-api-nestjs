import { Module } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { PlaylistsController } from './playlists.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Playlist, PlaylistSchema } from 'src/schemas/playlist.schema';
import { UserLibrary, UserLibrarySchema } from 'src/schemas/user-library.schema';
import { TracksModule } from '../tracks/tracks.module';
import { AlbumsModule } from '../albums/albums.module';

@Module({
  imports: [
    TracksModule,
    AlbumsModule,
    MongooseModule.forFeature([
      { name: Playlist.name, schema: PlaylistSchema },
      { name: UserLibrary.name, schema: UserLibrarySchema },
    ])
  ],
  controllers: [PlaylistsController],
  providers: [PlaylistsService],
})
export class PlaylistsModule {}
