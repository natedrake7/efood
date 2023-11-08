import { IsString } from "class-validator";

export class ProductAddonDto{
    @IsString()
    name: string;

    price: number;

}