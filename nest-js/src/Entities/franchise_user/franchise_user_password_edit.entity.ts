import { IsNotEmpty, IsStrongPassword } from "class-validator";

export class FranchiseUserPasswordEdit{
    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    @IsStrongPassword()
    new_password: string;
}