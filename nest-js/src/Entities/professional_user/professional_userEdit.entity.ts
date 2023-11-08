import { IsString,IsStrongPassword,IsEmail,IsPhoneNumber, isStrongPassword} from "class-validator";

export class ProfessionalUserEdit{
    username: string;

    address: string;

    delivery_time: number;

    description: string;

    password: string;

    email: string;
    
    phonenumber: string;

    city: string;

    zipcode: string;
}