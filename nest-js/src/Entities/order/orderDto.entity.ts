import { IsDate, IsString } from "class-validator";

export class OrderDto{
    @IsString()
    professionalName: string;

    price: number;

    @IsString()
    payment_method: string;

    completed_status: boolean;

    @IsDate()
    date: Date;
}