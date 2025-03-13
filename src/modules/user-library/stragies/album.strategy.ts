import { BadRequestException } from "@nestjs/common";
import { UserLibraryRepository } from "../user-library.repository";
import { convertObjectId } from "src/utils";
import { ALBUM_EXISTED } from "src/constants/server";

export class AlbumLibraryStrategy {
    constructor(private repository: UserLibraryRepository) {}

    async add(userId: string, albumId: string, isFavourite: boolean) {
        const userLibrary = await this.repository.findOrCreate(userId);
        
        const isExist = userLibrary.savedAlbums.some(item => item.albumId.toString() === albumId);
        if (isExist) {
            throw new BadRequestException(ALBUM_EXISTED);
        }

        userLibrary.savedAlbums.push({ albumId: convertObjectId(albumId), isFavourite });
        return await userLibrary.save();
    }

    async remove(userId: string, albumId: string) {
        return await this.repository.updateLibrary(userId, { $pull: { savedAlbums: { albumId: convertObjectId(albumId) } } });
    }
}
