import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ModelName } from 'src/constants/enum';
import { User } from './user.schema';

class TrackPosition {
    @Prop({ type: Types.ObjectId, ref: ModelName.TRACK, required: true })
    track: Types.ObjectId;

    @Prop({ required: true })
    position: number;
}

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

    @Prop({ type: Types.ObjectId, ref: ModelName.USER })
    createdBy: User;

    @Prop({ type: [{ track: { type: Types.ObjectId, ref: ModelName.TRACK }, position: Number }] })
    tracks: TrackPosition[];
}

export const PlaylistSchema = SchemaFactory.createForClass(Playlist);
