import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserLibrary, UserLibraryDocument } from "src/schemas/user-library.schema";
import { PaginationDto } from "src/shared";
import { convertObjectId, parseSortFields } from "src/utils";
import { LibraryItemType } from "./dto";

@Injectable()
export class UserLibraryRepository {
    constructor(
        @InjectModel(UserLibrary.name) private model: Model<UserLibraryDocument>
    ) {}

    async findOrCreate(userId: string) {
        let userLibrary = await this.model.findOne({ userId: convertObjectId(userId) });
        if (!userLibrary) {
            userLibrary = await this.model.create({ userId: convertObjectId(userId) });
        }
        return userLibrary;
    }

    async updateLibrary(userId: string, updateQuery: any) {
        return await this.model.findOneAndUpdate({ userId: convertObjectId(userId) }, updateQuery, { new: true });
    }

    async getSavedItems<T extends LibraryItemType>(userId: string, paginationDto: PaginationDto, type: T, isFavourite?: boolean) {
        const { page, limit, sort } = paginationDto;
        const skip = (page - 1) * limit;
        let sortCriteria = sort ? parseSortFields(sort) : { createdAt: -1 };

        const fieldName = `saved${type}s`; // savedArtists, savedTracks, savedPlaylists
        const idField = `${type.toLowerCase()}Id`; // artistId, trackId, playlistId
        const collectionName = `${type.toLowerCase()}s`; // artists, tracks, playlists

        const pipeline: any[] = [
            { $match: { userId: convertObjectId(userId) } },
            { $unwind: `$${fieldName}` },
        ];

        if (isFavourite !== undefined) {
            pipeline.push({ $match: { [`${fieldName}.isFavourite`]: isFavourite } });
        }

        pipeline.push(
            {
                $lookup: {
                    from: collectionName,
                    localField: `${fieldName}.${idField}`,
                    foreignField: "_id",
                    as: `${fieldName}.itemInfo`
                }
            },
            { $unwind: `$${fieldName}.itemInfo` },
            {
                $project: {
                    _id: 1,
                    [`${fieldName}.${idField}`]: 1,
                    [`${fieldName}.isFavourite`]: 1,
                    [`${fieldName}.itemInfo.name`]: 1,
                    [`${fieldName}.itemInfo.avatar_url`]: 1
                }
            },
            { $sort: sortCriteria },
            { $skip: skip },
            { $limit: limit },
            {
                $group: {
                    _id: "$_id",
                    [fieldName]: { $push: `$${fieldName}` }
                }
            }
        );

        const userLibrary = await this.model.aggregate(pipeline);
        return userLibrary[0]?.[fieldName] || [];
    }
}
