import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';
import { Playlist } from './playlist.schema';

export type UserPlaylistDocument = HydratedDocument<UserPlaylist>;

@Schema()
export class UserPlaylist {
    @Prop({ type: Types.ObjectId, ref: (() => User).name })
    user: User;

    @Prop({ type: Types.ObjectId, ref: (() => Playlist).name })
    playlist: Playlist;

    @Prop()
    role: string;
}

export const UserPlaylistSchema = SchemaFactory.createForClass(UserPlaylist);
