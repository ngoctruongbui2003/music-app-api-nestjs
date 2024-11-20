import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Track } from 'src/schemas/track.schema';
import { Artist } from './artist.schema';
import { ModelName } from 'src/constants/enum';

export type TrackArtistDocument = HydratedDocument<TrackArtist>;

@Schema()
export class TrackArtist {
    @Prop({ type: Types.ObjectId, ref: ModelName.TRACK })
    track: Track;

    @Prop({ type: Types.ObjectId, ref: ModelName.ARTIST })
    artist: Artist;
}

export const TrackArtistSchema = SchemaFactory.createForClass(TrackArtist);
