import { ConfigurableModuleBuilder, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './core/transform.interceptor';
import { AuthModule } from './modules/auth/auth.module';
import { ArtistsModule } from './modules/artists/artists.module';
import { TracksModule } from './modules/tracks/tracks.module';
import { AlbumsModule } from './modules/albums/albums.module';
import { PlaylistsModule } from './modules/playlists/playlists.module';
import { Connection } from 'mongoose';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ArtistsModule,
    TracksModule,
    AlbumsModule,
    PlaylistsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigurableModuleBuilder],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        onConnectionCreate: (connection: Connection) => {
          connection.on('connected', () => console.log('------Connected to MongoDB------'));
          connection.on('open', () => console.log('------Opened to MongoDB------'));
          connection.on('disconnected', () => console.log('------Disconnected from MongoDB------'));
          connection.on('reconnected', () => console.log('------Reconnected to MongoDB------'));
          connection.on('disconnecting', () => console.log('------Disconnecting from MongoDB------'));
        }
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
