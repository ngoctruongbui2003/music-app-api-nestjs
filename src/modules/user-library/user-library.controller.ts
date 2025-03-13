import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { UserLibraryService } from "./user-library.service";
import { GET_SUCCESS } from "src/constants/server";
import { PaginationDto } from "src/shared";

@Controller('user-library')
@UseGuards(JwtAuthGuard)
export class UserLibraryController {
    constructor(private readonly userLibraryService: UserLibraryService) {}

    @Post('artists')
    @HttpCode(HttpStatus.OK)
    async getSavedArtists(@Request() req, @Body() paginationDto: PaginationDto) {
        return {
            message: GET_SUCCESS,
            data: await this.userLibraryService.getSavedArtists(req.user.id, paginationDto)
        };
    }

    @Post('artists/favourite')
    @HttpCode(HttpStatus.OK)
    async getFavouriteArtists(@Request() req, @Body() paginationDto: PaginationDto) {
        return {
            message: GET_SUCCESS,
            data: await this.userLibraryService.getArtistsByFavouriteStatus(req.user.id, true, paginationDto)
        };
    }

    @Post('artists/not-favourite')
    @HttpCode(HttpStatus.OK)
    async getNonFavouriteArtists(@Request() req, @Body() paginationDto: PaginationDto) {
        return {
            message: GET_SUCCESS,
            data: await this.userLibraryService.getArtistsByFavouriteStatus(req.user.id, false, paginationDto)
        };
    }

    @Post('artist/:artistId')
    @HttpCode(HttpStatus.OK)
    async addArtist(@Request() req, @Param('artistId') artistId: string) {
        return {
            message: GET_SUCCESS,
            data: await this.userLibraryService.addArtistToLibrary(req.user.id, artistId)
        };
    }

    @Patch('remove-artist/:artistId')
    @HttpCode(HttpStatus.OK)
    async removeArtist(@Request() req, @Param('artistId') artistId: string) {
        return {
            message: GET_SUCCESS,
            data: await this.userLibraryService.removeArtistFromLibrary(req.user.id, artistId)
        };
    }

    @Patch('artist/:artistId/toggle-favourite')
    @HttpCode(HttpStatus.OK)
    async toggleFavourite(
        @Request() req,
        @Param('artistId') artistId: string, 
        @Body('isFavourite') isFavourite: string 
    ) {
        return {
            message: GET_SUCCESS,
            data: await this.userLibraryService.toggleFavouriteArtist(
                req.user.id,
                artistId,
                isFavourite === 'true'
            )
        };
    }
}
