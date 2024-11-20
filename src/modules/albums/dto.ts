import { PartialType } from "@nestjs/mapped-types";
import { IsDateString, IsMongoId } from "class-validator";

export class CreateAlbumDto {
    title: string;
    image_url: string;
    isPlayable: boolean;

    @IsDateString()
    release_date: Date;
    
    @IsMongoId()
    artist: string;
}

export class FindAlbumDto {
    chosenSelect: string;
    isPopulateArtist: boolean;
    isPopulateTrack: boolean;

    constructor(
        chosenSelect: string = '',
        isPopulateArtist: boolean = false,
        isPopulateTrack: boolean = false
    ) {
        this.chosenSelect = chosenSelect;
        this.isPopulateArtist = isPopulateArtist;
        this.isPopulateTrack = isPopulateTrack;
    }
}

export class UpdateAlbumDto extends PartialType(CreateAlbumDto) {}