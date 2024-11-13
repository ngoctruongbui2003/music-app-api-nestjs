import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ImageDto } from 'src/modules/artists/dto';

export type ArtistDocument = HydratedDocument<Artist>;

@Schema({ timestamps: true })
export class Artist {
    @Prop()
    name: string;

    @Prop()
    href: string;

    @Prop()
    avatarUrl: string;

    @Prop({ type:[ImageDto] })
    images: ImageDto[];
    
    @Prop({ default: 0 })
    followers: number;

    @Prop()
    genres: Array<string>;

    @Prop()
    type: Array<string>; // [artist, producer, etc.]

    @Prop({ default: false })
    isVerify: boolean;
}

export const ArtistSchema = SchemaFactory.createForClass(Artist);
