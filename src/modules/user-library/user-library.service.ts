import { PaginationDto } from './../../shared/dto';
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ModelName } from 'src/constants/enum';
import { CREATE_FAIL, USER_EXISTED } from "src/constants/server";
import { UserLibrary, UserLibraryDocument } from "src/schemas/user-library.schema";
import { convertObjectId, parseSortFields } from 'src/utils';

@Injectable()
export class UserLibraryService {
    constructor(
        @InjectModel(UserLibrary.name) private userLibraryModel: Model<UserLibraryDocument>
    ) {}

    async create(userId: string) {
        const userLibrary = await this.userLibraryModel.findOne({ userId });
        if (userLibrary) throw new BadRequestException(USER_EXISTED);

        const newUserLibrary = await this.userLibraryModel.create({ userId: convertObjectId(userId) });
        if (!newUserLibrary) throw new BadRequestException(CREATE_FAIL);

        return newUserLibrary;
    }

    async addArtistToLibrary(userId: string, artistId: string, isFavourite: boolean = false) {
        const userLibrary = await this.userLibraryModel.findOne({ userId: convertObjectId(userId) });
    
        // 1. If userLibrary doesn't exist, create a new one
        if (!userLibrary) {
            return await this.userLibraryModel.create({
                userId: convertObjectId(userId),
                savedArtists: [{ artistId: convertObjectId(artistId), isFavourite }]
            });
        }
    
        // 2. Check if artist is already saved
        const isArtistSaved = userLibrary.savedArtists.some(
            (item) => item.artistId.toString() === artistId
        );
    
        if (isArtistSaved) {
            throw new BadRequestException('Artist này đã được lưu!');
        }
    
        // 3. Add artist to savedArtists
        userLibrary.savedArtists.push({ artistId: convertObjectId(artistId), isFavourite });
        await userLibrary.save();
    
        return userLibrary;
    }

    async removeArtistFromLibrary(userId: string, artistId: string) {
        return this.userLibraryModel.findOneAndUpdate(
            { userId: convertObjectId(userId) },
            { $pull: { savedArtists: { artistId: convertObjectId(artistId) } } },
            { new: true }
        );
    }

    async toggleFavouriteArtist(userId: string, artistId: string, isFavourite: boolean) {
        const userLibrary = await this.userLibraryModel.findOne({ userId: convertObjectId(userId) });
        if (!userLibrary) {
            throw new BadRequestException('User library not found!');
        }
    
        const artistIndex = userLibrary.savedArtists.findIndex(
            (item) => item.artistId.toString() === artistId
        );
    
        if (artistIndex === -1) {
            throw new BadRequestException('Artist not found in user library!');
        }
    
        // Cập nhật trực tiếp giá trị isFavourite trong mảng savedArtists
        userLibrary.savedArtists[artistIndex].isFavourite = isFavourite;
    
        // Lưu lại thay đổi
        await userLibrary.save();
    
        return userLibrary;
    }

    private async getSavedArtistsQuery(userId: string, paginationDto: PaginationDto, isFavourite?: boolean) {
        const { page, limit, sort } = paginationDto;
        const skip = (page - 1) * limit;
        let sortCriteria = {};
    
        if (sort) {
            sortCriteria = parseSortFields(sort);
        }
    
        const pipeline: any[] = [
            { $match: { userId: convertObjectId(userId) } },
            { $unwind: "$savedArtists" }
        ];
    
        if (isFavourite !== undefined) {
            pipeline.push({ $match: { "savedArtists.isFavourite": isFavourite } });
        }
    
        pipeline.push(
            {
                $lookup: {
                    from: "artists",  // Tên collection của Artist
                    localField: "savedArtists.artistId",
                    foreignField: "_id",
                    as: "savedArtists.artistInfo"
                }
            },
            { $unwind: "$savedArtists.artistInfo" },
            {
                $project: {
                    _id: 1,
                    "savedArtists.artistId": 1,
                    "savedArtists.isFavourite": 1,
                    "savedArtists.artistInfo.name": 1,
                    "savedArtists.artistInfo.avatar_url": 1
                }
            },
            { $sort: Object.keys(sortCriteria).length > 0 ? sortCriteria : { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $group: {
                    _id: "$_id",
                    savedArtists: { $push: "$savedArtists" }
                }
            }
        );
    
        const userLibrary = await this.userLibraryModel.aggregate(pipeline);
        return userLibrary[0]?.savedArtists || [];
    }
    
    // Hàm lấy tất cả artist đã lưu
    async getSavedArtists(userId: string, paginationDto: PaginationDto) {
        return this.getSavedArtistsQuery(userId, paginationDto);
    }
    
    // Hàm lấy artist theo trạng thái favourite
    async getArtistsByFavouriteStatus(userId: string, isFavourite: boolean, paginationDto: PaginationDto) {
        return this.getSavedArtistsQuery(userId, paginationDto, isFavourite);
    }
}
