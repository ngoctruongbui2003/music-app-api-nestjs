import { PartialType } from '@nestjs/mapped-types';

export class CreateTrackDto {
    title: string;
    duration_ms: number;
    description: string;
    lyric: string;
    genre: string[];
    image_url: string;
    url_media: string;
    album_order_position: number;
    isPlayable: boolean;
    isExplicit: boolean;
    release_date: Date;
    
    album: string;
    artist: string;
    trackArtists: string[];
}

export class UpdateTrackDto extends PartialType(CreateTrackDto) {}