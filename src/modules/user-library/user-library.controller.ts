import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { UserLibraryService } from "./user-library.service";
import { GET_SUCCESS } from "src/constants/server";
import { PaginationDto } from "src/shared";
import { LibraryItemType } from "./dto";

@Controller('user-library')
@UseGuards(JwtAuthGuard)
export class UserLibraryController {
    constructor(private readonly userLibraryService: UserLibraryService) {}

    @Post(':type')
    @HttpCode(HttpStatus.OK)
    async getSavedItems(
        @Request() req, 
        @Param('type') type: LibraryItemType, 
        @Body() paginationDto: PaginationDto
    ) {
        return {
            message: GET_SUCCESS,
            data: await this.userLibraryService.getSavedItems(req.user.id, type, paginationDto)
        };
    }

    @Post(':type/favourite')
    @HttpCode(HttpStatus.OK)
    async getFavouriteItems(
        @Request() req, 
        @Param('type') type: LibraryItemType, 
        @Body() paginationDto: PaginationDto
    ) {
        return {
            message: GET_SUCCESS,
            data: await this.userLibraryService.getItemsByFavouriteStatus(req.user.id, type, true, paginationDto)
        };
    }

    @Post(':type/not-favourite')
    @HttpCode(HttpStatus.OK)
    async getNonFavouriteItems(
        @Request() req, 
        @Param('type') type: LibraryItemType, 
        @Body() paginationDto: PaginationDto
    ) {
        return {
            message: GET_SUCCESS,
            data: await this.userLibraryService.getItemsByFavouriteStatus(req.user.id, type, false, paginationDto)
        };
    }

    @Post(':type/:itemId')
    @HttpCode(HttpStatus.OK)
    async addItem(
        @Request() req, 
        @Param('type') type: LibraryItemType, 
        @Param('itemId') itemId: string
    ) {
        return {
            message: GET_SUCCESS,
            data: await this.userLibraryService.addToLibrary(req.user.id, itemId, type)
        };
    }

    @Post(':type/:itemId/favourite')
    @HttpCode(HttpStatus.OK)
    async addItemFavourite(
        @Request() req, 
        @Param('type') type: LibraryItemType, 
        @Param('itemId') itemId: string
    ) {
        return {
            message: GET_SUCCESS,
            data: await this.userLibraryService.addToLibrary(req.user.id, itemId, type, true)
        };
    }

    @Patch('remove/:type/:itemId')
    @HttpCode(HttpStatus.OK)
    async removeItem(
        @Request() req, 
        @Param('type') type: LibraryItemType, 
        @Param('itemId') itemId: string
    ) {
        return {
            message: GET_SUCCESS,
            data: await this.userLibraryService.removeFromLibrary(req.user.id, itemId, type)
        };
    }

    @Patch(':type/:itemId/toggle-favourite')
    @HttpCode(HttpStatus.OK)
    async toggleFavourite(
        @Request() req,
        @Param('type') type: LibraryItemType,
        @Param('itemId') itemId: string, 
        @Body('isFavourite') isFavourite: string 
    ) {
        return {
            message: GET_SUCCESS,
            data: await this.userLibraryService.toggleFavourite(req.user.id, itemId, type, isFavourite === 'true')
        };
    }

    @Get(':type/:itemId/is-favourite')
    @HttpCode(HttpStatus.OK)
    async isItemInFavourite(
        @Request() req,
        @Param('type') type: LibraryItemType,
        @Param('itemId') itemId: string
    ) {
        return {
            message: GET_SUCCESS,
            data: await this.userLibraryService.isItemInFavourite(req.user.id, itemId, type)
        };
    }
}
