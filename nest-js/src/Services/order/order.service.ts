import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProfessionalUser } from "src/Entities/professional_user/professionaluser.entity";
import { PrimaryGeneratedColumn, Repository } from "typeorm";
import { Product } from "src/Entities/products/product.entity";
import { User } from "src/Entities/user/user.entity";
import { Order } from "src/Entities/order/order.entity";
import { Address } from "src/Entities/addresses/address.entity";
import { OrderDto } from "src/Entities/order/orderDto.entity";
import { ProductAddon } from "src/Entities/products/product_addon.entity";
import { OrderProductAddon } from "src/Entities/order/order_product_addon.entity";
import { generateKey } from "crypto";

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
                @InjectRepository(OrderProductAddon)
                private OrderProductAddonRepository: Repository<OrderProductAddon>){}
    
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

        completeproducts.forEach(async product =>{
            const productDb = await this.ProductRepository.findOneBy({id:product.ID});
            product.addonsID.forEach(async addon =>{
                const addonDb = await this.AddonRepository.findOneBy({id:addon});
                const orderProductAddon = await this.OrderProductAddonRepository.create({
                    addon:addonDb,
                    product:productDb,
                    order:orderDb
                });
                await this.OrderProductAddonRepository.save(orderProductAddon);
            });
        });
    }

}