import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProfessionalUser } from "src/Entities/professional_user/professionaluser.entity";
import { DataSource, Repository } from "typeorm";
import { Product } from "src/Entities/products/product.entity";
import { User } from "src/Entities/user/user.entity";
import { Order } from "src/Entities/order/order.entity";
import { Address } from "src/Entities/addresses/address.entity";
import { OrderDto } from "src/Entities/order/orderDto.entity";
import { ProductAddon } from "src/Entities/products/product_addon.entity";
import { OrderItem } from "src/Entities/order/order_item.entity";
import { OrderReturnDto } from "src/Entities/order/order_return.entity";
import { OrderQueries } from "src/DbQueries/OrderQueries";
import { ProfessionalUserQueries } from "src/DbQueries/ProfessionalUserQueries";
import { AddressQueries } from "src/DbQueries/AddressQueries";
import { ProductQueries } from "src/DbQueries/ProductQueries";

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
                private OrderItemRepository: Repository<OrderItem>,
                private dataSource: DataSource,
                private OrderQueries: OrderQueries,
                private ProfessionalUserQueries: ProfessionalUserQueries,
                private AddressQueries: AddressQueries,
                private ProductQueries: ProductQueries){}
    
    async Create(user: User,orderDto: OrderDto,professionalID: string,completeproducts: {ID :string,addonsID :string[]}[],addressID: string):Promise<void>{

        const professionalUser = await this.ProfessionalUserQueries.GetUserById(professionalID);
        
        if(!professionalUser)
            throw new UnauthorizedException("Professional User doesn't exist!");

        const address = await this.AddressQueries.GetAddressById(addressID,user.id);

        if(!address)
            throw new UnauthorizedException("Invalid address!");

        return await this.OrderQueries.CreateOrder(completeproducts,professionalID,user.id,orderDto,addressID);    
    }

    async GetUserOrderById(id: string,user: User):Promise<Order>{
        
        if(!user)
            throw new UnauthorizedException("User is not registered!");

        return await this.OrderQueries.GetOrderById(id,user.id);
    }

    async GetProfessionalOrderById(id: string,user: ProfessionalUser):Promise<void | OrderReturnDto>{
        const order = await this.OrderRepository.findOneBy({id,professionalUser:user});
        if(!order)
            throw new UnauthorizedException("Order ID invalid!");
        var products: Product[] = [];
        const orderItems = await this.OrderItemRepository.findBy({order});
        for(const orderItem of orderItems)
        {
            orderItem.product.addons = orderItem.addons;
            products.push(orderItem.product);
        }  
        var returnOrder = new OrderReturnDto(
            order,
            products
        );
        returnOrder.address = order.address;
        return returnOrder;
    }

    async GetAllProfessionalOrders(user: ProfessionalUser):Promise<void | OrderReturnDto[]>{
        const orders = await this.OrderRepository.findBy({professionalUser:user});
        if(!orders)
            throw new UnauthorizedException("User doesn't have any orders!");
        var return_orders: OrderReturnDto[] = [];
        var products: Product[] = [];
        for(const order of orders)
        {
            const orderItems = await this.OrderItemRepository.findBy({order});
            for(const orderItem of orderItems)
                products.push(orderItem.product);
            return_orders.push(new OrderReturnDto(order,products))
            products = [];            
        }
        return return_orders;
    }

    async GetAllUserOrders(user: User):Promise<void | OrderReturnDto[]>{
        const orders = await this.OrderRepository.findBy({user});
        if(!orders)
            throw new UnauthorizedException("User doesn't have any orders!");
        var return_orders: OrderReturnDto[] = [];
        var products: Product[] = [];
        for(const order of orders)
        {
            const orderItems = await this.OrderItemRepository.findBy({order});
            for(const orderItem of orderItems)
               products.push(orderItem.product);
            return_orders.push(new OrderReturnDto(order,products))
            products = [];            
        }
        return return_orders;
    }

}