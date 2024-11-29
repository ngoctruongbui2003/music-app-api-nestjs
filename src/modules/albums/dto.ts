import { PartialType } from "@nestjs/mapped-types";
import { IsBoolean, IsDateString, IsMongoId, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreateAlbumDto {
    title: string;
    image_url: string;
    isPlayable: boolean;

    @IsDateString()
    release_date: Date;

    @IsOptional()
    type: string;
    
    @IsMongoId()
    creator: string;
}

export class UpdateAlbumDto extends PartialType(CreateAlbumDto) {}

export class FindAlbumDto {
    @IsOptional()
    @IsString()
    select?: string;

    @IsOptional()
    @IsBoolean()
    isPopulateCreator?: boolean;
}

export class PaginationAlbumDto extends PartialType(FindAlbumDto) {
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
