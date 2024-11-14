import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { AccountProduct, AccountType } from 'src/constants/enum';
import { UserPlaylist } from './user.playlist.schema';

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

    @Prop()
    avatar_url: string;

    @Prop({ default: 0 })
    followers: number;

    @Prop({ enum: AccountProduct, default: AccountProduct.FREE })
    product: string;

    @Prop({ enum: AccountType, default: AccountType.LOCAL })
    account_type: string;

    // RELATIONSHIP
    @Prop({ type: [{ type: Types.ObjectId, ref: UserPlaylist.name }] })
    userPlaylists: UserPlaylist[];
}

export const UserSchema = SchemaFactory.createForClass(User);
