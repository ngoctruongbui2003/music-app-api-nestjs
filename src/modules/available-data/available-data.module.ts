import { Module } from '@nestjs/common';
import { AvailableDataService } from './available-data.service';
import { AvailableDataController } from './available-data.controller';
import { AlbumsModule } from '../albums/albums.module';
import { ArtistsModule } from '../artists/artists.module';
import { TracksModule } from '../tracks/tracks.module';

@Module({
  imports: [
    AlbumsModule,
    ArtistsModule,
    TracksModule,
  ],
  controllers: [AvailableDataController],
  providers: [AvailableDataService],
})
export class AvailableDataModule {}
