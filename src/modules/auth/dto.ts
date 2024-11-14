import { PartialType } from "@nestjs/mapped-types";
import { IsEmail, IsNotEmpty } from "class-validator";

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
}

export class LoginWithPlatformDto extends PartialType(RegisterDto) {
    
}

