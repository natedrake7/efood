import { ProductAddonDto } from "./addonDto.entity";

export class ProductDto{
    id?: string;

    name: string;

    size: string;

    price: number;

    type: string;

    description: string;

    availability: boolean;
}