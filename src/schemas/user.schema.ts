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

    @Prop({ default: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fcellphones.com.vn%2Fsforum%2Favatar-trang&psig=AOvVaw2U5vWnJr7AF4Xvxje4Ez7b&ust=1731720047170000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCPjR9YOW3YkDFQAAAAAdAAAAABAE' })
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
