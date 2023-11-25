import { IsNotEmpty, IsStrongPassword } from "class-validator";

export class ProfessionalUserPasswordEditDto{

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    @IsStrongPassword()
    new_password: string;
}