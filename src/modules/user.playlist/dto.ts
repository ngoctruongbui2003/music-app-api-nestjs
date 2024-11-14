import { PartialType } from '@nestjs/mapped-types';

export class CreateUserPlaylistDto {}
export class UpdateUserPlaylistDto extends PartialType(CreateUserPlaylistDto) {}
