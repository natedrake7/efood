import {IsString, MaxLength, MinLength} from "class-validator";

export class AuthSignIn{
    @IsString({message: 'Invalid username!'})
    @MinLength(4,{message: 'Invalid username!'})
    @MaxLength(20,{message: 'Invalid username!'})
    username: string;
    
    @IsString({message: 'Invalid password!'})
    @MinLength(8,{message: 'Invalid password!'})
    @MaxLength(20,{message: 'Invalid password!'})
    password:string;
}

export class FranchiseProfessionalSignIn{
    @IsString({message: 'Invalid username!'})
    @MinLength(4,{message: 'Invalid username!'})
    @MaxLength(20,{message: 'Invalid username!'})
    username: string;
}