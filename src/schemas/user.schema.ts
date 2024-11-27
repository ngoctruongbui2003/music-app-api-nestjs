import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { AccountProduct, AccountType, ModelName } from 'src/constants/enum';
import { Playlist } from './playlist.schema';
import { Track } from './track.schema';
import { Album } from './album.schema';
import { Artist } from './artist.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Prop()
    email: string;

    @Prop()
    password: string;

    @Prop()
    display_name: string;

    @Prop()
    country: string;

    @Prop({ default: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fcellphones.com.vn%2Fsforum%2Favatar-trang&psig=AOvVaw2U5vWnJr7AF4Xvxje4Ez7b&ust=1731720047170000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCPjR9YOW3YkDFQAAAAAdAAAAABAE' })
    avatar_url: string;

    @Prop({ default: 0 })
    followers: number;

    @Prop({ enum: AccountProduct, default: AccountProduct.FREE })
    product: string;

    @Prop({ enum: AccountType, default: AccountType.LOCAL })
    account_type: string;

    // RELATIONSHIP
    @Prop({
        type: [
            {
                track: { type: Types.ObjectId, ref: ModelName.TRACK },
                addedAt: { type: Date, default: Date.now },
            },
        ],
        default: [],
    })
    history: { track: Track; addedAt: Date }[];

    @Prop({
        type: [
            {
                track: { type: Types.ObjectId, ref: ModelName.PLAYLIST },
                addedAt: { type: Date, default: Date.now },
            },
        ],
        default: []
    })
    playlists: Playlist[];

    @Prop({
        type: [
            {
                track: { type: Types.ObjectId, ref: ModelName.TRACK },
                addedAt: { type: Date, default: Date.now },
            },
        ],
        default: []
    })
    favorite_tracks: Track[];

    @Prop({
        type: [
            {
                track: { type: Types.ObjectId, ref: ModelName.ALBUM },
                addedAt: { type: Date, default: Date.now },
            },
        ],
        default: []
    })
    favorite_albums: Album[];

    @Prop({
        type: [
            {
                track: { type: Types.ObjectId, ref: ModelName.ARTIST },
                addedAt: { type: Date, default: Date.now },
            },
        ],
        default: []
    })
    favorite_artists: Artist[];

}

export const UserSchema = SchemaFactory.createForClass(User);
