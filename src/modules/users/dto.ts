import { OmitType, PartialType } from "@nestjs/mapped-types";
import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class CreateUserDto {
    @IsEmail({}, { message: 'Invalid email' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;
    
    @IsOptional()
    password: string;

    @IsNotEmpty({ message: 'Name is required' })
    display_name: string;

    @IsOptional()
    country: string;

    @IsOptional()
    product: string;

    @IsOptional()
    account_type: string;
}

export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['password'] as const)) {
    
}

export class UpdateUserPasswordDto {
    @IsNotEmpty({ message: 'Password is required' })
    oldPassword: string;

    @IsNotEmpty({ message: 'New password is required' })
    newPassword: string;
}

export class FindUserDto {
    chosenSelect: string;
    isPopulateUserPlaylist: boolean;

    constructor(
        chosenSelect: string = '',
        isPopulateUserPlaylist: boolean = false
    ) {
        this.chosenSelect = chosenSelect;
        this.isPopulateUserPlaylist = isPopulateUserPlaylist
    }
}
