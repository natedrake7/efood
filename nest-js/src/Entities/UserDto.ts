import { IsString,MinLength,MaxLength,IsStrongPassword,IsEmail,IsPhoneNumber} from "class-validator";


export class UserDto{
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string;

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    firstname: string;

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    lastname: string;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @IsStrongPassword()
    password: string;

    @IsEmail()
    email: string;

    @IsPhoneNumber()
    phonenumber: string;

    role: string;
}