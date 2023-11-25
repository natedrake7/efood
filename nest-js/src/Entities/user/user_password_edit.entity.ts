import { IsNotEmpty, IsStrongPassword } from "class-validator";

export class UserPasswordEdit{
    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    @IsStrongPassword()
    new_password: string;
}