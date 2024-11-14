import { PartialType } from "@nestjs/mapped-types";
import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {
    @IsEmail({}, { message: 'Invalid email' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;
    
    password: string;
    display_name: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {

}
