import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Artist } from './artist.schema';
import { Track } from './track.schema';

export type AlbumDocument = HydratedDocument<Album>;

@Schema({ timestamps: true })
export class Album {
    @Prop()
    title: string;

    @Prop()
    image_url: string;

    @Prop()
    total_duration_ms: number;

    @Prop()
    total_tracks: number;

    @Prop({ default: 0 })
    total_play: number;

    @Prop()
    isPlayable: boolean;

    @Prop()
    release_date: Date;

    // RELATIONSHIP

    @Prop({ type: Types.ObjectId, ref: (() => Artist).name })
    artist: Artist;

    @Prop({ type: [{ type: Types.ObjectId, ref: (() => Track).name }] })
    tracks: Track[];

}

export const AlbumSchema = SchemaFactory.createForClass(Album);