import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Track } from './track.schema';
import { Playlist } from './playlist.schema';
import { ModelName } from 'src/constants/enum';

export type TrackPlaylistDocument = HydratedDocument<TrackPlaylist>;

@Schema()
export class TrackPlaylist {
    @Prop({ type: Types.ObjectId, ref: ModelName.TRACK })
    track: Track;

    @Prop({ type: Types.ObjectId, ref: ModelName.PLAYLIST })
    playlist: Playlist;

    @Prop()
    order_position: number;
}

export const TrackPlaylistSchema = SchemaFactory.createForClass(TrackPlaylist);
