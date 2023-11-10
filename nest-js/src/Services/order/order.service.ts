import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProfessionalUser } from "src/Entities/professional_user/professionaluser.entity";
import { Repository } from "typeorm";
import { Product } from "src/Entities/products/product.entity";
import { User } from "src/Entities/user/user.entity";
import { Order } from "src/Entities/order/order.entity";
import { Address } from "src/Entities/addresses/address.entity";
import { OrderDto } from "src/Entities/order/orderDto.entity";
import { ProductAddon } from "src/Entities/products/product_addon.entity";
import { OrderItem } from "src/Entities/order/order_item.entity";

@Injectable()
export class OrderService{
    constructor(@InjectRepository(ProfessionalUser)
                private ProfessionalRepository: Repository<ProfessionalUser>,
                @InjectRepository(Product)
                private ProductRepository: Repository<Product>,
                @InjectRepository(ProductAddon)
                private AddonRepository: Repository<ProductAddon>,
                @InjectRepository(Order)
                private OrderRepository: Repository<Order>,
                @InjectRepository(Address)
                private AddressRepository: Repository<Address>,
                @InjectRepository(OrderItem)
                private OrderItemRepository: Repository<OrderItem>){}
    
    async Create(user: User,orderDto: OrderDto,professionalID: string,completeproducts: {ID :string,addonsID :string[]}[],addressID: string):Promise<void>{
        const professionalUser = await this.ProfessionalRepository.findOneBy({id:professionalID});
        if(!professionalUser)
            throw new UnauthorizedException("User doesn't exist!");

        const {professionalName,price,payment_method,completed_status,date} = orderDto;
        const address = await this.AddressRepository.findOneBy({id:addressID});
        if(!address)
            throw new UnauthorizedException("Invalid address!");

        const order = await this.OrderRepository.create({
            professionalName,
            price,
            payment_method,
            completed_status,
            date,
            address,
            user,
            professionalUser
        });
        const orderDb = await this.OrderRepository.save(order);
        var addonsArray: ProductAddon[] = [];
        completeproducts.forEach(async product =>{
            const productDb = await this.ProductRepository.findOneBy({id:product.ID});
            product.addonsID.forEach(async addon =>{
                const addonDb = await this.AddonRepository.findOneBy({id:addon});
                addonsArray = [...addonsArray,addonDb];
                console.log(addonsArray);
            });
            const orderItem = await this.OrderItemRepository.create({
                product:productDb,
                order:orderDb,
                addons:addonsArray,
                quantity:1
            });
            await this.OrderItemRepository.save(orderItem);
            addonsArray = [];
        });


    }

    async GetUserOrderById(id: string,user: User):Promise<void | Order>{
        const order = await this.OrderRepository.findOneBy({id,user});
        if(!order)
            throw new UnauthorizedException("Order ID invalid!");
        return order;
    }

    async GetProfessionalOrderById(id: string,user: ProfessionalUser):Promise<void | Order>{
        const order = await this.OrderRepository.findOneBy({id,professionalUser:user});
        if(!order)
            throw new UnauthorizedException("Order ID invalid!");
        return order;
    }

    async GetAllProfessionalOrders(user: ProfessionalUser):Promise<void | Order[]>{
        const orders = await this.OrderRepository.findBy({professionalUser:user});
        if(!orders)
            throw new UnauthorizedException("User doesn't have any orders!");
        var products: Product[];
        orders.forEach(async order => {
            products = [];
            const orderProductAddons = await this.OrderItemRepository.findBy({order});
            orderProductAddons.forEach( orderProductAddon =>{
                if(!products.includes(orderProductAddon.product))
                {
                    
                }
            })
        })
        return orders;
    }

    async GetAllUserOrders(user: User):Promise<void | Order[]>{
        const orders = await this.OrderRepository.findBy({user});
        if(!orders)
            throw new UnauthorizedException("User doesn't have any orders!");
        return orders;
    }

}