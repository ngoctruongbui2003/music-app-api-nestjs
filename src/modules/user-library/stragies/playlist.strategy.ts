import { BadRequestException } from "@nestjs/common";
import { UserLibraryRepository } from "../user-library.repository";
import { convertObjectId } from "src/utils";
import { PLAYLIST_EXISTED } from "src/constants/server";

export class PlaylistLibraryStrategy {
    constructor(private repository: UserLibraryRepository) {}

    async add(userId: string, playlistId: string, isFavourite: boolean) {
        const userLibrary = await this.repository.findOrCreate(userId);
        
        const isExist = userLibrary.savedPlaylists.some(item => item.playlistId.toString() === playlistId);
        if (isExist) {
            throw new BadRequestException(PLAYLIST_EXISTED);
        }

        userLibrary.savedPlaylists.push({ playlistId: convertObjectId(playlistId), isFavourite });
        return await userLibrary.save();
    }

    async remove(userId: string, playlistId: string) {
        return await this.repository.updateLibrary(userId, { $pull: { savedPlaylists: { playlistId: convertObjectId(playlistId) } } });
    }
}
