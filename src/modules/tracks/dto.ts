import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsMongoId, IsNumber, IsOptional, IsString, Min } from 'class-validator';

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
    creator: string;
    collaborators: string[];
}

export class UpdateTrackDto extends PartialType(CreateTrackDto) {}

export class FindTrackDto {
    @IsOptional()
    @IsString()
    select?: string;

    @IsOptional()
    @IsBoolean()
    isPopulateAlbum?: boolean;

    @IsOptional()
    @IsBoolean()
    isPopulateCreator?: boolean;

    @IsOptional()
    @IsBoolean()
    isPopulateCollaborators?: boolean;
}

export class PaginationTrackDto extends PartialType(FindTrackDto) {
    @IsOptional()
    @IsNumber()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @IsNumber()
    @Min(1)
    limit?: number = 10;

    @IsOptional()
    @IsString()
    sort?: string;
}