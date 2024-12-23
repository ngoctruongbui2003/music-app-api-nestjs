import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Artist } from './artist.schema';
import { Album } from './album.schema';
import { Genre, ModelName } from 'src/constants/enum';

export type TrackDocument = HydratedDocument<Track>;

@Schema({ timestamps: true })
export class Track {
    @Prop()
    title: string;

    @Prop()
    description: string;

    @Prop()
    duration_ms: number;

    @Prop()
    lyric: string;
    
    @Prop({ type: [String], enum: Genre })
    genre: Array<Genre>;

    @Prop()
    image_url: string;

    @Prop()
    url_media: string;

    @Prop({ default: 0 })
    album_order_position: number;

    @Prop({ default: 0 })
    total_play: number;

    @Prop()
    isPlayable: boolean;

    @Prop()
    isExplicit: boolean;

    @Prop()
    release_date: Date;

    // RELATIONSHIP
    @Prop({ type: Types.ObjectId, ref: ModelName.ALBUM })
    album: Album;

    @Prop({ type: Types.ObjectId, ref: ModelName.ARTIST })
    creator: Artist;

    @Prop({ type: [{ type: Types.ObjectId, ref: ModelName.ARTIST }] })
    collaborators: Types.ObjectId[];
}

export const TrackSchema = SchemaFactory.createForClass(Track);
