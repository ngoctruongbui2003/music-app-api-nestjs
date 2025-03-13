import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ModelName } from 'src/constants/enum';

export type UserLibraryDocument = HydratedDocument<UserLibrary>;

@Schema({ _id: false })
class SavedPlaylist {
    @Prop({ type: Types.ObjectId, ref: ModelName.PLAYLIST, required: true })
    playlistId: Types.ObjectId;

    @Prop({ default: false })
    isFavourite: boolean;
}

@Schema({ _id: false })
class SavedArtist {
    @Prop({ type: Types.ObjectId, ref: ModelName.ARTIST, required: true })
    artistId: Types.ObjectId;

    @Prop({ default: false })
    isFavourite: boolean;
}

    @Schema({ timestamps: true, collection: 'user_libraries' })
    export class UserLibrary {
        @Prop({ type: Types.ObjectId, ref: ModelName.USER, required: true })
        userId: Types.ObjectId;

        @Prop({ type: [SavedPlaylist], default: [] })
        savedPlaylists: SavedPlaylist[];

        @Prop({ type: [SavedArtist], default: [] })
        savedArtists: SavedArtist[];
    }

export const UserLibrarySchema = SchemaFactory.createForClass(UserLibrary);
