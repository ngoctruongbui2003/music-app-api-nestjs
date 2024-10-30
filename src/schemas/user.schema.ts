import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

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
    images: string;

    @Prop()
    account_type: string;

    @Prop({ default: 0 })
    followers: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
