import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, ValidateNested } from "class-validator";

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
    chosenSelect: string;
    isPopulateAlbum: boolean;

    constructor(
        chosenSelect: string = '',
        isPopulateAlbum: boolean = false
    ) {
        this.chosenSelect = chosenSelect;
        this.isPopulateAlbum = isPopulateAlbum;
    }
}
