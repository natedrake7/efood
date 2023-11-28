import { IsString,MinLength,MaxLength,IsStrongPassword,IsEmail,IsPhoneNumber} from "class-validator";
import { z } from 'zod';

export class FranchiseUserDto{
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @IsStrongPassword()
    password: string;

    @IsEmail()
    email: string;

    @IsPhoneNumber()
    phonenumber: string;

    @IsString()
    description: string;
}