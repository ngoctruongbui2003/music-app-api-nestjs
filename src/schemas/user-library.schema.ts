import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ModelName } from 'src/constants/enum';

export type UserLibraryDocument = HydratedDocument<UserLibrary>;

@Schema({ timestamps: true })
export class UserLibrary {
    @Prop({ type: Types.ObjectId, ref: ModelName.USER, required: true })
    user: Types.ObjectId;

    @Prop({ type: [{ type: Types.ObjectId, ref: ModelName.PLAYLIST }] })
    savedPlaylists: Types.ObjectId[];
}

export const UserLibrarySchema = SchemaFactory.createForClass(UserLibrary);
