import { PartialType } from '@nestjs/mapped-types';
import { Types } from 'mongoose';

export class CreateTrackDto {
    title: string;
    duration_ms: number;
    genre: string;
    imageUrl: string;
    url_media: string;
    album_position: number;
    isPlayable: boolean;
    isExplicit: boolean;
    artists: Types.ObjectId[];
    createdBy: string;
    release_date: Date;
}

export class UpdateTrackDto extends PartialType(CreateTrackDto) {}