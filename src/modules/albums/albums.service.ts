import { Injectable } from '@nestjs/common';
import { CreateAlbumDto, UpdateAlbumDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { Album } from 'src/schemas/album.schema';
import { Model } from 'mongoose';

@Injectable()
export class AlbumsService {
  constructor(@InjectModel(Album.name) private albumModel: Model<Album>) {}

  create(createAlbumDto: CreateAlbumDto) {
    return 'This action adds a new album';
  }

  findAll() {
    return `This action returns all albums`;
  }

  findOne(id: number) {
    return `This action returns a #${id} album`;
  }

  update(id: number, updateAlbumDto: UpdateAlbumDto) {
    return `This action updates a #${id} album`;
  }

  remove(id: number) {
    return `This action removes a #${id} album`;
  }
}
