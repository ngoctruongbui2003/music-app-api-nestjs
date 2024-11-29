import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from "class-validator";

export class ImageDto {
    url: string;
    isCover: boolean;
}

export class CreateArtistDto {
    @IsNotEmpty({ message: 'Name is required' })
    name: string;

    @IsNotEmpty({ message: 'Description is required' })
    description: string;

    avatar_url: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ImageDto)
    images: ImageDto[];

    @IsArray()
    genres: Array<string>;

    @IsArray()
    type: Array<string>; // [artist, producer, etc.]
}

export class UpdateArtistDto extends PartialType(CreateArtistDto) {
    
}

export class FindArtistDto {
    @IsOptional()
    @IsString()
    select?: string;
}

export class PaginationArtistDto extends PartialType(FindArtistDto) {
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
