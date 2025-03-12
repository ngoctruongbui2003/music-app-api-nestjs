import { IsArray, IsString } from "class-validator";
import { Types } from "mongoose";

export class CreatePlaylistDto {
    @IsString()
    title: string;
}

export class SavePlaylistDto {
    @IsString()
    playlistId: string;
}

export class AddTracksDto {
    @IsString()
    playlistId: string;

    @IsString()
    trackId: string;
}

export class AddAlbumDto {
    @IsString()
    playlistId: string;

    @IsString()
    albumId: string;
}