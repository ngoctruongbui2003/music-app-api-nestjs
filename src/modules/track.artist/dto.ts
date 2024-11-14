import { PartialType } from '@nestjs/mapped-types';

export class CreateTrackArtistDto {}
export class UpdateTrackArtistDto extends PartialType(CreateTrackArtistDto) {}
