import {IsString} from "class-validator";

export class AuthSignIn{
    @IsString()
    username: string;
    
    @IsString()
    password:string;
}