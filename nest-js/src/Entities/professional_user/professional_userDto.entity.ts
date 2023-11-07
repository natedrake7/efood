import { IsString,MinLength,MaxLength,IsStrongPassword,IsEmail,IsPhoneNumber} from "class-validator";
import { Column } from "typeorm";


export class ProfessionalUserDto{
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string;

    @IsString()
    address: string;

    @Column()
    delivery_time: number;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @IsStrongPassword()
    password: string;

    @IsEmail()
    email: string;

    @IsPhoneNumber()
    phonenumber: string;

    @Column({length:500})
    description: string;
}