import { BadRequestException, Injectable } from '@nestjs/common';
import { albums, albumsForIdMongo, artists, artistsForIdMongo, songs } from 'src/db/fake';
import { CreateArtistDto, ImageDto } from '../artists/dto';
import { ArtistsService } from '../artists/artists.service';
import { CREATE_FAIL } from 'src/constants/server';
import { CreateAlbumDto } from '../albums/dto';
import { AlbumsService } from '../albums/albums.service';
import { CreateTrackDto } from '../tracks/dto';
import { Genre } from 'src/constants/enum';
import { TracksService } from '../tracks/tracks.service';

@Injectable()
export class AvailableDataService {
    constructor(
        private readonly artistsService: ArtistsService,
        private readonly albumsService: AlbumsService,
        private readonly tracksService: TracksService,
    ) {}


    async createArtistAvailable() {
        let newArtists = {};

        for (const artist of artists) {
        const images = new ImageDto();
        images.url = 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DvPz8ftK_4bk&psig=AOvVaw25Wlb7ubkLbxo1gYfvzrK5&ust=1731639430259000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCLi83drp2okDFQAAAAAdAAAAABAE';
        images.isCover = true;

        const createArtistDto = new CreateArtistDto();
        createArtistDto.name = artist;
        createArtistDto.description = `This is a ${artist} artist`;
        createArtistDto.avatar_url = 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fthanhnien.vn%2Fdanh-doi-hanh-trinh-truong-thanh-cua-rapper-obito-185231012110144312.htm&psig=AOvVaw2o2daCfEBqXV_-4Ow-_tiV&ust=1731639239085000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCOCq18rp2okDFQAAAAAdAAAAABAE';
        createArtistDto.images = [images];
        createArtistDto.genres = ['pop'];
        createArtistDto.type = ['artist'];

        const newArtist = await this.artistsService.create(createArtistDto);
        if (!newArtist) throw new BadRequestException(CREATE_FAIL);

        newArtists[newArtist.name] = newArtist._id;
        }

        return newArtists;
    }

    async createAlbumAvailable() {
        let newAlbums = {};

        for (let album in albums) {
            const createAlbumDto = new CreateAlbumDto();
            createAlbumDto.title = albums[album];
            createAlbumDto.image_url = "https://www.google.com/url?sa=i&url=https%3A%2F%2Fopen.spotify.com%2Falbum%2F1wmnEWgcDdCcOujQpLwYxc&psig=AOvVaw2xeX9UF2VAjOv3Du7hm-Ow&ust=1731902027411000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCJjG4vq74okDFQAAAAAdAAAAABAE";
            createAlbumDto.isPlayable = true;
            createAlbumDto.release_date = new Date();
            createAlbumDto.creator = artistsForIdMongo[album];

            const newAlbum = await this.albumsService.create(createAlbumDto);
            if (!newAlbum) throw new BadRequestException(CREATE_FAIL);

            newAlbums[newAlbum.title] = newAlbum._id;
        }

        return newAlbums;
    }

    async createTrackAvailable() {
        let listTrack = [];

        for (const track of songs) {
            // get artists in song
            let artists = track.artist;

            // create track
            const createTrackDto = new CreateTrackDto();
            createTrackDto.title = track.title;
            createTrackDto.duration_ms = 0;
            createTrackDto.genre = [Genre.POP, Genre.RAP];
            createTrackDto.description = 'Đây là bài hát của ' + artists[0];
            createTrackDto.lyric = track.lyric;
            createTrackDto.image_url = track.cover_img;
            createTrackDto.url_media = track.url_media;
            createTrackDto.album_order_position = 0;
            createTrackDto.isPlayable = true;
            createTrackDto.isExplicit = true;
            createTrackDto.release_date = new Date();
            createTrackDto.creator = artistsForIdMongo[artists[0]];
            createTrackDto.collaborators = artists.map(artist => artistsForIdMongo[artist]);

            let newTrack;

            // if album exist
            if (albums[artists[0]]) {
                // add track to exist album
                newTrack = await this.tracksService.create(createTrackDto);
                if (!newTrack) throw new BadRequestException(CREATE_FAIL);

                let albumId = albumsForIdMongo[albums[artists[0]]];
                newTrack.album = albumId;

                const album = await this.albumsService.addTrack(albumId, newTrack._id);
                newTrack.album_order_position = album.tracks.length - 1;
            } else {
                // create single album and track
                newTrack = await this.tracksService.createTrackWithAlbumSingle(createTrackDto);
            }

            newTrack.save();

            listTrack.push(newTrack);
        }

        return listTrack;
    }
}
