import { IsString } from "class-validator";

export class OrderDto{
    @IsString()
    professionalName: string;

    price: number;

    @IsString()
    payment_method: string;
}