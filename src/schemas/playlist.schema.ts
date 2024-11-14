import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { TrackPlaylist } from './track.playlist.schema';
import { UserPlaylist } from './user.playlist.schema';

export type PlaylistDocument = HydratedDocument<Playlist>;

@Schema({ timestamps: true })
export class Playlist {
    @Prop()
    title: string;
    
    @Prop()
    image_url: string;

    @Prop({ default: 0 })
    total_duration_ms: number;

    @Prop()
    total_tracks: number;

    @Prop({ default: 0 })
    total_play: number;

    @Prop({ default: 0 })
    total_save: number;

    @Prop({ default: false })
    isPublic: boolean;

    @Prop()
    release_date: Date;

    // REALTIONSHIP

    @Prop({ type: [{ type: Types.ObjectId, ref: (() => TrackPlaylist).name }] })
    trackPlaylists: TrackPlaylist[];

    @Prop({ type: [{ type: Types.ObjectId, ref: (() => UserPlaylist).name }] })
    userPlaylists: UserPlaylist[];
}

export const PlaylistSchema = SchemaFactory.createForClass(Playlist);
