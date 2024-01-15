import {IsPhoneNumber, IsString, Max, MaxLength, Min, MinLength} from "class-validator";
import { Transform as ClassTransform, ClassTransformer, Transform } from 'class-transformer';

export class AddressDto{
    @IsString()
    @MinLength(3,{message: 'Address must be at least 3 characters!'})
    @MaxLength(40,{message: 'Address must be at most 40 characters!'})
    address: string;

    @IsString()
    @MinLength(1,{message: 'Address number cannot be empty!'})
    @MaxLength(10,{message: 'Address number cannot be more than 10 characters!'})
    number : string;

    @IsString()
    @MinLength(5,{message: 'Zipcode must be at least 5 characters!'})
    @MaxLength(10,{message: 'Zipcode cannot be more than 10 characters!'})
    zipcode : string;

    @IsString()
    @MinLength(3,{message: 'City cannot be empty!'})
    @MaxLength(20,{message: 'City can be at most 20 characters!'})
    city: string;

    @IsString()
    @IsPhoneNumber('GR',{message:'Phonenumber must me a valid phonenumber!'})
    phonenumber: string;

    @IsString()
    @MinLength(4,{message: 'Ringbell name cannot be empty!'})
    @MaxLength(20,{message: 'Ringbell name can be at most 20 characters!'})
    ringbell: string;
    
    @Min(0,{message: 'Floors must be at least 0'})
    @Max(20,{message: 'Floor cannot exceed 20!'})
    @Transform(({ value }) => value = +value)
    floor : number;
}