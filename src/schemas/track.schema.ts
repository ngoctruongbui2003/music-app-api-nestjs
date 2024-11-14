
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Artist } from './artist.schema';
import { Album } from './album.schema';
import { Genre } from 'src/constants/enum';
import { TrackPlaylist } from './track.playlist.schema';
import { TrackArtist } from './track.artist.schema';

export type TrackDocument = HydratedDocument<Track>;

@Schema({ timestamps: true })
export class Track {
    @Prop()
    title: string;

    @Prop()
    duration_ms: number;
    
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
    @Prop({ type: Types.ObjectId, ref: (() => Album).name })
    album: Album;

    @Prop({ type: Types.ObjectId, ref: (() => Artist).name })
    artist: Artist;

    @Prop({ type: [{ type: Types.ObjectId, ref: (() => TrackPlaylist).name }] })
    trackPlaylists: TrackPlaylist[];

    @Prop({ type: [{ type: Types.ObjectId, ref: (() => TrackArtist).name }] })
    trackArtists: TrackArtist[];
}

export const TrackSchema = SchemaFactory.createForClass(Track);
