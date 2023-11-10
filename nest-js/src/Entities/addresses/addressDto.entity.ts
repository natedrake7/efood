import { IsNumber, IsPhoneNumber, IsString} from "class-validator";

export class AddressDto{
    @IsString()
    address: string;

    @IsString()
    number : string;

    @IsString()
    zipcode : string;

    @IsString()
    city: string;

    @IsString()
    @IsPhoneNumber()
    phonenumber: string;

    @IsString()
    ringbell: string;
    
    floor : number;
}