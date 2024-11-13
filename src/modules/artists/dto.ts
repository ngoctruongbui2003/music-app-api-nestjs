import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, ValidateNested } from "class-validator";

export class ImageDto {
    url: string;
    isCover: boolean;
}

export class CreateArtistDto {
    @IsNotEmpty({ message: 'Name is required' })
    name: string;

    avatarUrl: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ImageDto)
    images: ImageDto[];

    @IsArray()
    genres: Array<string>;

    @IsArray()
    type: Array<string>; // [artist, producer, etc.]
}

export class UpdateArtistDto {
    name: string;
    avatarUrl: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ImageDto)
    images: ImageDto[];

    @IsArray()
    genres: Array<string>;

    @IsArray()
    type: Array<string>; // [artist, producer, etc.]
}