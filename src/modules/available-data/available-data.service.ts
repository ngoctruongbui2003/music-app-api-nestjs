import { BadRequestException, Injectable } from '@nestjs/common';
import { artists, artistsForIdMongo, songs } from 'src/db/fake';
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
        createArtistDto.avatar_url = 'https://danviet.mediacdn.vn/296231569849192448/2023/11/14/jennie-1664529951896406065518-1675850656917967930881-16999652421692136186085.jpg';
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
        // let newAlbums = {};

        // for (let album in albums) {
        //     const createAlbumDto = new CreateAlbumDto();
        //     createAlbumDto.title = albums[album];
        //     createAlbumDto.image_url = "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/cover/3/3/a/4/33a4ee2a3b97a446b1c3f6592a7cc912.jpg";
        //     createAlbumDto.isPlayable = true;
        //     createAlbumDto.release_date = new Date();
        //     createAlbumDto.creator = artistsForIdMongo[album];

        //     const newAlbum = await this.albumsService.create(createAlbumDto);
        //     if (!newAlbum) throw new BadRequestException(CREATE_FAIL);

        //     newAlbums[newAlbum.title] = newAlbum._id;
        // }

        // return newAlbums;
    }

    async createTrackAndAlbumAvailable() {
        let listTrack = [];

        for (const playlist of songs) {
            let songs = playlist.songs;
            let album = playlist.playlist;
            let albumId;

            if (album) {
                const createAlbumDto = new CreateAlbumDto();
                createAlbumDto.title = album;
                createAlbumDto.image_url = songs[0].cover_img;
                createAlbumDto.isPlayable = true;
                createAlbumDto.release_date = new Date();
                createAlbumDto.creator = artistsForIdMongo[songs[0].artist[0]];

                const newAlbum = await this.albumsService.create(createAlbumDto);
                if (!newAlbum) throw new BadRequestException(CREATE_FAIL);

                albumId = newAlbum._id;
            }

            let positionAlbum = 0;

            for (const track of songs) {
                // create track
                const createTrackDto = new CreateTrackDto();
                createTrackDto.title = track.title;
                createTrackDto.duration_ms = 0;
                createTrackDto.genre = [Genre.POP, Genre.RAP];
                createTrackDto.description = 'Đây là bài hát của ' + track.artist[0];
                createTrackDto.lyric = track.lyric;
                createTrackDto.image_url = track.cover_img;
                createTrackDto.url_media = track.url_media;
                createTrackDto.album_order_position = album ? positionAlbum++ : 0;
                createTrackDto.isPlayable = true;
                createTrackDto.isExplicit = true;
                createTrackDto.release_date = new Date();
                createTrackDto.creator = artistsForIdMongo[track.artist[0]];
                createTrackDto.collaborators = (track.artist?.length > 1)
                    ? track.artist.slice(1).map(a => artistsForIdMongo[a])
                    : [];

                let newTrack;

                // if album exist
                if (album) {
                    // add track to exist album
                    createTrackDto.album = albumId;
                    newTrack = await this.tracksService.create(createTrackDto);
                    if (!newTrack) throw new BadRequestException(CREATE_FAIL);

                    await this.albumsService.addTrack(albumId, newTrack._id);
                } else {
                    // create single album and track
                    newTrack = await this.tracksService.createTrackWithAlbumSingle(createTrackDto);
                }

                listTrack.push(newTrack);
            }
        }

        return listTrack;
    }
}
