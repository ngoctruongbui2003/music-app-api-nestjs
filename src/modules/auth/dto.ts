import { PartialType } from "@nestjs/mapped-types";
import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class LoginDto {
    @IsEmail({}, { message: 'Invalid email' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;
    
    @IsNotEmpty({ message: 'Password is required' })
    password: string;
}

export class RegisterDto {
    @IsEmail({}, { message: 'Invalid email' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @IsNotEmpty({ message: 'Password is required' })
    password: string;

    @IsNotEmpty({ message: 'Name is required' })
    display_name: string;

    @IsOptional()
    country: string;
}

export class LoginWithPlatformDto extends PartialType(RegisterDto) {
    @IsOptional()
    avatar_url: string;

    @IsNotEmpty({ message: 'Account type is required' })
    account_type: string;
}

