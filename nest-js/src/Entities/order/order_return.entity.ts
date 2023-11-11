import { Product } from "../products/product.entity";
import { Order } from "./order.entity";
import { Address } from "../addresses/address.entity";

export class OrderReturnDto{
    constructor(order: Order,products: Product[]){
        this.id = order.id;
        this.professionalName = order.professionalName;
        this.price = order.price;
        this.payment_method = order.payment_method
        this.completed_status = order.completed_status;
        this.date = order.date;
        this.products = products;
    }
    
    id: string;

    professionalName: string;

    price: number;

    payment_method: string;

    completed_status: boolean;

    date: Date;

    products: Product[];

    address: Address;
}