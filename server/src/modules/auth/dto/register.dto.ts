import { IsEmail,IsNotEmpty, IsString, MinLength } from "class-validator";

export class RegisterDto {
    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({},{message: 'Invalid email'})
    email: string;

    @MinLength(6, {message: "passowrd must be atleast 6 characters long"})
    @IsNotEmpty({ message: 'Email is required' })
    @IsString()
    password: string;

    @IsString()
    @IsNotEmpty({ message: 'Name is required' })
    name: string;
}