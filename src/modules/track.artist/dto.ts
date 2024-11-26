import { PartialType } from '@nestjs/mapped-types';

export class CreateTrackArtistDto {
    track: string;
    artist: string;
}
export class UpdateTrackArtistDto extends PartialType(CreateTrackArtistDto) {}
