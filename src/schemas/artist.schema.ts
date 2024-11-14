import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ImageDto } from 'src/modules/artists/dto';
import { ArtistType, Genre } from 'src/constants/enum';
import { Track } from './track.schema';
import { Album } from './album.schema';
import { TrackArtist } from './track.artist.schema';

export type ArtistDocument = HydratedDocument<Artist>;

@Schema({ timestamps: true })
export class Artist {
    @Prop()
    name: string;

    @Prop()
    description: string;

    @Prop()
    avatar_url: string;

    @Prop({ type:[ImageDto] })
    images: ImageDto[];
    
    @Prop({ default: 0 })
    followers: number;

    @Prop({ type: [String], enum: Genre })
    genres: Array<Genre>;

    @Prop({ type: [String], enum: ArtistType })
    type: Array<ArtistType>; // [artist, producer, etc.]

    @Prop({ default: false })
    isVerify: boolean;

    // RELATIONSHIP

    @Prop({ type: [{ type: Types.ObjectId, ref: (() => Track).name }] })
    tracks: Track[];

    @Prop({ type: [{ type: Types.ObjectId, ref: (() => Album).name }] })
    albums: Album[];

    @Prop({ type: [{ type: Types.ObjectId, ref: (() => TrackArtist).name }] })
    trackArtists: TrackArtist[];
}

export const ArtistSchema = SchemaFactory.createForClass(Artist);
