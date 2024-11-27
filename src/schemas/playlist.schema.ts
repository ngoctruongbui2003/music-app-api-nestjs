import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ModelName } from 'src/constants/enum';
import { User } from './user.schema';
import { Track } from './track.schema';

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
    owner: User;

    @Prop({
    type: [
        {
            trackId: { type: Types.ObjectId, ref: ModelName.TRACK },
            position: { type: Number, required: true },
        },
    ],
    })
    tracks: { trackId: Types.ObjectId; position: number }[];
}

export const PlaylistSchema = SchemaFactory.createForClass(Playlist);
