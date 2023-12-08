import { IsString,MinLength,MaxLength,IsStrongPassword,IsEmail,IsPhoneNumber} from "class-validator";
import { Match } from "src/match.decorator";


export class UserDto{

    @MinLength(4,{message: 'Username must be more than 4 and less than 20 characters!'})
    @MaxLength(20,{message: 'Username must be more than 4 and less than 20 characters!'})
    @IsString({message:'Username must be a string!'})
    username: string;

    @MinLength(4,{message: 'Firstname must be more than 4 and less than 20 characters!'})
    @MaxLength(20,{message: 'Firstname must be more than 4 and less than 20 characters!'})
    @IsString({message:'Firstname must be a string!'})
    firstname: string;

    @MinLength(4,{message: 'Lastname must be more than 4 and less than 20 characters!'})
    @MaxLength(20,{message: 'Lastname must be more than 4 and less than 20 characters!'})
    @IsString({message:'Lastname must be a string!'})
    lastname: string;

    @MinLength(8,{message: 'Password must be more than 8 and less than 20 characters!'})
    @MaxLength(20,{message: 'Password must be more than 8 and less than 20 characters!'})
    @IsString({message:'Password must be a string!'})
    @IsStrongPassword({},{message:'Password must have at least one uppercase letter and one special character!'})
    password: string;

    @Match('password',{message:'Password confirmation must match password!'})
    confirm_password: string;

    @IsEmail({},{message: 'Email must be a valid email address'})
    email: string;

    @IsPhoneNumber('GR',{message:'Phonenumber must me a valid phonenumber!'})
    phonenumber: string;
}