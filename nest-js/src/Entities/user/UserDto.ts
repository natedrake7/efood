import { IsString,MinLength,MaxLength,IsStrongPassword,IsEmail,IsPhoneNumber, IsAlpha} from "class-validator";


export class UserDto{

    @MinLength(4)
    @MaxLength(20)
    @IsString()
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
}