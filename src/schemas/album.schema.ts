import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Artist } from './artist.schema';
import { Track } from './track.schema';
import { AlbumType, ModelName } from 'src/constants/enum';

export type AlbumDocument = HydratedDocument<Album>;

@Schema({ timestamps: true })
export class Album {
    @Prop()
    title: string;

    @Prop()
    image_url: string;

    @Prop({ default: 0 })
    total_duration_ms: number;

    @Prop({ default: 0 })
    total_tracks: number;

    @Prop({ default: 0 })
    total_play: number;

    @Prop()
    isPlayable: boolean;

    @Prop({ enum: AlbumType, default: AlbumType.ALBUM })
    type: string;

    @Prop()
    release_date: Date;

    // RELATIONSHIP

    @Prop({ type: Types.ObjectId, ref: ModelName.ARTIST })
    creator: Artist;

    @Prop({ type: [{ type: Types.ObjectId, ref: ModelName.TRACK }] })
    tracks: Track[];

}

export const AlbumSchema = SchemaFactory.createForClass(Album);