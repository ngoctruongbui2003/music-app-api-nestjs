import { PaginationDto } from './../../shared/dto';
import { BadRequestException, Injectable } from "@nestjs/common";
import { UserLibraryRepository } from './user-library.repository';
import { ArtistLibraryStrategy } from './stragies/artist.strategy';
import { TrackLibraryStrategy } from './stragies/track.strategy';
import { PlaylistLibraryStrategy } from './stragies/playlist.strategy';
import { AlbumLibraryStrategy } from './stragies/album.strategy';
import { LibraryItemType } from './dto';

@Injectable()
export class UserLibraryService {
    private strategies: any;

    constructor(private repository: UserLibraryRepository) {
        this.strategies = {
            Artist: new ArtistLibraryStrategy(this.repository),
            Track: new TrackLibraryStrategy(this.repository),
            Playlist: new PlaylistLibraryStrategy(this.repository),
            Album: new AlbumLibraryStrategy(this.repository),
        };
    }

    async addToLibrary<T extends LibraryItemType>(userId: string, itemId: string, type: T, isFavourite = false) {
        return this.strategies[type].add(userId, itemId, isFavourite);
    }

    async removeFromLibrary<T extends LibraryItemType>(userId: string, itemId: string, type: T) {
        return this.strategies[type].remove(userId, itemId);
    }

    async toggleFavourite<T extends LibraryItemType>(userId: string, itemId: string, type: T, isFavourite: boolean) {
        const userLibrary = await this.repository.findOrCreate(userId);
        const savedItems: Array<{ [key: string]: any; isFavourite: boolean }> = userLibrary[`saved${type}s`] || [];

        const itemIndex = savedItems.findIndex((item: { [key: string]: any }) => item[`${type.toLowerCase()}Id`].toString() === itemId);
        if (itemIndex === -1) {
            throw new BadRequestException(`${type} not found in user library!`);
        }

        savedItems[itemIndex].isFavourite = isFavourite;
        await userLibrary.save();
        return userLibrary;
    }

    async isItemInFavourite<T extends LibraryItemType>(userId: string, itemId: string, type: T): Promise<boolean> {
        const userLibrary = await this.repository.findOrCreate(userId);
        const savedItems = userLibrary[`saved${type}s`];

        const item = savedItems.find(item => item[`${type.toLowerCase()}Id`].toString() === itemId);
        return item ? item.isFavourite : false;
    }
    
    async getSavedItems<T extends LibraryItemType>(userId: string, type: T, paginationDto: PaginationDto) {
        return this.repository.getSavedItems(userId, paginationDto, type);
    }

    async getItemsByFavouriteStatus<T extends LibraryItemType>(userId: string, type: T, isFavourite: boolean, paginationDto: PaginationDto) {
        return this.repository.getSavedItems(userId, paginationDto, type, isFavourite);
    }
}
