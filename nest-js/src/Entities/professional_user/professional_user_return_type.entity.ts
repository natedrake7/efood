import { Product } from "../products/product.entity";
import { ProfessionalUser } from "./professionaluser.entity";

export class ProfessionalUserReturnType{
    constructor(user: ProfessionalUser){
        this.id = user.id;
        this.address = user.address;
        this.city = user.city;
        this.zipcode = user.zipcode;
        this.open_status = user.open_status;
        this.timetable = user.timetable;
        this.rating = user.rating;
        this.delivery_time = user.delivery_time;
        this.email = user.email;
        this.phonenumber = user.phonenumber;
        this.description = user.description;
        this.image = user.image;
    }

    id: string;

    address: string;

    city: string;

    zipcode: string;

    open_status: boolean;

    timetable: string;

    rating: number;

    delivery_time: number;

    email: string;

    phonenumber: string;
    
    description: string;

    image: Buffer;

    products: Product[];
}