import { isArray, IsArray, IsString } from "class-validator";
import { Types } from "mongoose";

export class CreatePlaylistDto {
    @IsString()
    title: string;
}

export class SavePlaylistDto {
    @IsString()
    playlistId: string;
}

export class AddTrackDto {
    @IsString()
    playlistId: string;

    @IsString()
    trackId: string;
}

export class AddTracksDto {
    @IsString()
    playlistId: string;

    @IsArray()
    trackIds: string[];
}

export class AddAlbumDto {
    @IsString()
    playlistId: string;

    @IsString()
    albumId: string;
}

export class AddPlaylistDto {
    @IsString()
    playlistId: string;

    @IsString()
    otherPlaylistId: string;
}
