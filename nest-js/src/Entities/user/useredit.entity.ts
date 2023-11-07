import { IsString,IsStrongPassword,IsEmail,IsPhoneNumber} from "class-validator";

export class UserEdit{
    id : number;

    username: string;

    firstname: string;

    lastname: string;

    password: string;

    email: string;

    phonenumber: string;
}