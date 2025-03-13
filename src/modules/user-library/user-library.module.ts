import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserLibraryController } from './user-library.controller';
import { UserLibraryService } from './user-library.service';
import { UserLibrary, UserLibrarySchema } from 'src/schemas/user-library.schema';

@Module({
    imports: [MongooseModule.forFeature([
        { name: UserLibrary.name, schema: UserLibrarySchema }
    ])],
    controllers: [UserLibraryController],
    providers: [UserLibraryService]
})
export class UserLibraryModule {}
