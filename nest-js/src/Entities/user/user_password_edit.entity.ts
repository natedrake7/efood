import { IsNotEmpty, IsStrongPassword } from "class-validator";

export class UserPasswordEdit{
    @IsNotEmpty({message:'Old Password cannot be empty!'})
    password: string;

    @IsNotEmpty()
    @IsStrongPassword({},{message:'New password is not strong enough!'})
    new_password: string;
}