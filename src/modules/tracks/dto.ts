import { PartialType } from '@nestjs/mapped-types';
import { Types } from 'mongoose';

export class CreateTrackDto {
    title: string;
    duration_ms: number;
    genre: string;
    image_url: string;
    url_media: string;
    album_order_position: number;
    isPlayable: boolean;
    isExplicit: boolean;
    release_date: Date;
    
    artists: Types.ObjectId[];
    createdBy: string;
}

export class UpdateTrackDto extends PartialType(CreateTrackDto) {}