import { BadRequestException } from "@nestjs/common";
import { UserLibraryRepository } from "../user-library.repository";
import { convertObjectId } from "src/utils";
import { ARTIST_EXISTED } from "src/constants/server";

export class ArtistLibraryStrategy {
    constructor(private repository: UserLibraryRepository) {}

    async add(userId: string, artistId: string, isFavourite: boolean) {
        const userLibrary = await this.repository.findOrCreate(userId);
        
        const isExist = userLibrary.savedArtists.some(item => item.artistId.toString() === artistId);
        if (isExist) {
            throw new BadRequestException(ARTIST_EXISTED);
        }

        userLibrary.savedArtists.push({ artistId: convertObjectId(artistId), isFavourite });
        return await userLibrary.save();
    }

    async remove(userId: string, artistId: string) {
        return await this.repository.updateLibrary(userId, { $pull: { savedArtists: { artistId: convertObjectId(artistId) } } });
    }
}
