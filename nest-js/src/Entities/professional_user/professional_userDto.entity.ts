import { IsString,MinLength,MaxLength,IsStrongPassword,IsEmail,IsPhoneNumber, IsNumber} from "class-validator";
import { Column } from "typeorm";


export class ProfessionalUserDto{
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string;

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    name: string;

    @IsString()
    address: string;

    delivery_time: number;

    @IsString()
    @MinLength(4)
    @MaxLength(100)
    type: string;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @IsStrongPassword()
    password: string;

    @IsString()
    city:string;

    zipcode: string;

    @IsString()
    timetable: string;

    @IsEmail()
    email: string;

    @IsPhoneNumber()
    phonenumber: string;

    @Column({length:500})
    description: string;
}