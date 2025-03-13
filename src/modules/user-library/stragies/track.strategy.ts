import { BadRequestException } from "@nestjs/common";
import { UserLibraryRepository } from "../user-library.repository";
import { convertObjectId } from "src/utils";
import { TRACK_EXISTED } from "src/constants/server";

export class TrackLibraryStrategy {
    constructor(private repository: UserLibraryRepository) {}

    async add(userId: string, trackId: string, isFavourite: boolean) {
        const userLibrary = await this.repository.findOrCreate(userId);
        
        const isExist = userLibrary.savedTracks.some(item => item.trackId.toString() === trackId);
        if (isExist) {
            throw new BadRequestException(TRACK_EXISTED);
        }

        userLibrary.savedTracks.push({ trackId: convertObjectId(trackId), isFavourite });
        return await userLibrary.save();
    }

    async remove(userId: string, trackId: string) {
        return await this.repository.updateLibrary(userId, { $pull: { savedTracks: { trackId: convertObjectId(trackId) } } });
    }
}
