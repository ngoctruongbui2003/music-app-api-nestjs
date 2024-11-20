import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';
import { Playlist } from './playlist.schema';
import { ModelName } from 'src/constants/enum';

export type UserPlaylistDocument = HydratedDocument<UserPlaylist>;

@Schema()
export class UserPlaylist {
    @Prop({ type: Types.ObjectId, ref: ModelName.USER })
    user: User;

    @Prop({ type: Types.ObjectId, ref: ModelName.PLAYLIST })
    playlist: Playlist;

    @Prop()
    role: string;
}

export const UserPlaylistSchema = SchemaFactory.createForClass(UserPlaylist);
