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
    refreshToken?: string;

    @Prop()
    display_name: string;

    @Prop()
    country: string;

    @Prop({ default: 'https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg' })
    avatar_url: string;

    @Prop({ default: 0 })
    followers: number;

    @Prop({ enum: AccountProduct, default: AccountProduct.FREE })
    product: string;

    @Prop({ enum: AccountType, default: AccountType.LOCAL })
    account_type: string;

    @Prop({ default: 0 })
    publicTrackCount: number;

    // RELATIONSHIP
    // @Prop({
    //     type: [
    //         {
    //             track: { type: Types.ObjectId, ref: ModelName.TRACK },
    //             addedAt: { type: Date, default: Date.now },
    //         },
    //     ],
    //     default: [],
    // })
    // history: { track: Track; addedAt: Date }[];

    // @Prop({
    //     type: [
    //         {
    //             track: { type: Types.ObjectId, ref: ModelName.PLAYLIST },
    //             addedAt: { type: Date, default: Date.now },
    //         },
    //     ],
    //     default: []
    // })
    // playlists: Playlist[];

    // @Prop({
    //     type: [
    //         {
    //             track: { type: Types.ObjectId, ref: ModelName.TRACK },
    //             addedAt: { type: Date, default: Date.now },
    //         },
    //     ],
    //     default: []
    // })
    // favorite_tracks: Track[];

    // @Prop({
    //     type: [
    //         {
    //             track: { type: Types.ObjectId, ref: ModelName.ALBUM },
    //             addedAt: { type: Date, default: Date.now },
    //         },
    //     ],
    //     default: []
    // })
    // favorite_albums: Album[];

    // @Prop({
    //     type: [
    //         {
    //             track: { type: Types.ObjectId, ref: ModelName.ARTIST },
    //             addedAt: { type: Date, default: Date.now },
    //         },
    //     ],
    //     default: []
    // })
    // favorite_artists: Artist[];

}

export const UserSchema = SchemaFactory.createForClass(User);
