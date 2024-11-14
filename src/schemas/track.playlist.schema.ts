
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Track } from './track.schema';
import { Playlist } from './playlist.schema';

export type TrackPlaylistDocument = HydratedDocument<TrackPlaylist>;

@Schema()
export class TrackPlaylist {
    @Prop({ type: Types.ObjectId, ref: (() => Track).name })
    track: Track;

    @Prop({ type: Types.ObjectId, ref: (() => Playlist).name })
    playlist: Playlist;

    @Prop()
    order_position: number;
}

export const TrackPlaylistSchema = SchemaFactory.createForClass(TrackPlaylist);
