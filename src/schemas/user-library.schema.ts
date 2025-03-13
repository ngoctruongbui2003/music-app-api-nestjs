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


@Schema({ _id: false })
class SavedTrack {
    @Prop({ type: Types.ObjectId, ref: ModelName.TRACK, required: true })
    trackId: Types.ObjectId;

    @Prop({ default: false })
    isFavourite: boolean;
}


@Schema({ _id: false })
class SavedAlbum {
    @Prop({ type: Types.ObjectId, ref: ModelName.ALBUM, required: true })
    albumId: Types.ObjectId;

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

        @Prop({ type: [SavedTrack], default: [] })
        savedTracks: SavedTrack[];

        @Prop({ type: [SavedAlbum], default: [] })
        savedAlbums: SavedAlbum[];
    }

export const UserLibrarySchema = SchemaFactory.createForClass(UserLibrary);
