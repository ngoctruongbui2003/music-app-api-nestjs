import { PartialType } from '@nestjs/mapped-types';

export class CreateTrackPlaylistDto {}
export class UpdateTrackPlaylistDto extends PartialType(CreateTrackPlaylistDto) {}
