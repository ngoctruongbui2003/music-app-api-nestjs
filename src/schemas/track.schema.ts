import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Artist } from './artist.schema';
import { Album } from './album.schema';
import { Genre, ModelName } from 'src/constants/enum';
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
    @Prop({ type: Types.ObjectId, ref: ModelName.ALBUM })
    album: Album;

    @Prop({ type: Types.ObjectId, ref: ModelName.ARTIST })
    artist: Artist;

    @Prop({ type: [{ type: Types.ObjectId, ref: ModelName.TRACK_PLAYLIST }] })
    trackPlaylists: TrackPlaylist[];

    @Prop({ type: [{ type: Types.ObjectId, ref: ModelName.TRACK_ARTIST }] })
    trackArtists: TrackArtist[];
}

export const TrackSchema = SchemaFactory.createForClass(Track);
