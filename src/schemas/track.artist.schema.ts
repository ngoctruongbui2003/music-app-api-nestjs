import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Track } from 'src/schemas/track.schema';
import { Artist } from './artist.schema';

export type TrackArtistDocument = HydratedDocument<TrackArtist>;

@Schema()
export class TrackArtist {
    @Prop({ type: Types.ObjectId, ref: (() => Track).name })
    track: Track;

    @Prop({ type: Types.ObjectId, ref: (() => Artist).name })
    artist: Artist;
}

export const TrackArtistSchema = SchemaFactory.createForClass(TrackArtist);
