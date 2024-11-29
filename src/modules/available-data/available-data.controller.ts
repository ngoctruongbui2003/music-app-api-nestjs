import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AvailableDataService } from './available-data.service';
import { CREATE_SUCCESS } from 'src/constants/server';

@Controller('available-data')
export class AvailableDataController {
  constructor(private readonly availableDataService: AvailableDataService) {}

  @Post('/artist')
  async createArtistAvailable() {
    return {
      message: CREATE_SUCCESS,
      data: await this.availableDataService.createArtistAvailable()
    }
  }

  @Post('/album')
  async createAlbumAvailable() {
    return {
      message: CREATE_SUCCESS,
      data: await this.availableDataService.createAlbumAvailable()
    }
  }

  @Post('/track')
  async createTrackAvailable() {
    return {
      message: CREATE_SUCCESS,
      data: await this.availableDataService.createTrackAvailable()
    }
  }
}
