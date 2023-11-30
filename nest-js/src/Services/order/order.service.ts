import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ProfessionalUser } from "src/Entities/professional_user/professionaluser.entity";
import { User } from "src/Entities/user/user.entity";
import { Order } from "src/Entities/order/order.entity";
import { OrderDto } from "src/Entities/order/orderDto.entity";
import { OrderQueries } from "src/DbQueries/OrderQueries";
import { ProfessionalUserQueries } from "src/DbQueries/ProfessionalUserQueries";
import { AddressQueries } from "src/DbQueries/AddressQueries";
import { BadRequestException } from "@nestjs/common/exceptions";

@Injectable()
export class OrderService{
    constructor(private OrderQueries: OrderQueries,
                private ProfessionalUserQueries: ProfessionalUserQueries,
                private AddressQueries: AddressQueries){}
    
    async Create(user: User,orderDto: OrderDto,professionalID: string,completeproducts: {ID :string,count: number,size:string,addonsID :string[]}[],addressID: string):Promise<void>{
        const professionalUser = await this.ProfessionalUserQueries.GetUserById(professionalID);
        
        if(!professionalUser)
            throw new BadRequestException("Professional User doesn't exist!");

        const address = await this.AddressQueries.GetAddressById(addressID,user.id);

        if(!address)
            throw new BadRequestException("Invalid address!");

        return await this.OrderQueries.CreateOrder(completeproducts,professionalID,user.id,orderDto,addressID);    
    }

    async GetOrderById(id: string,user: User | ProfessionalUser,IsUserProfessional:boolean = false):Promise<Order>{
        
        if(!user)
            throw new UnauthorizedException("User is not registered!");

        return await this.OrderQueries.GetOrderById(id,user.id,IsUserProfessional);
    }

    async UpdateProfessionalOrderById(id: string, user: ProfessionalUser):Promise<void>{
        if(!user)
            throw new UnauthorizedException("User is not registered!");

        return await this.OrderQueries.UpdateOrderAsCompletedById(id,user.id);
    }

    async GetAllUserOrders(user: User | ProfessionalUser,IsUserProfessional:boolean = false):Promise<Order[]>{
        if(!user)
            throw new UnauthorizedException("User is not registered!");
        return await this.OrderQueries.GetAllOrdersByUserId(user.id,IsUserProfessional);
    }

    async CancelOrder(id: string, user : User):Promise<void>{
        if(!user)
            throw new UnauthorizedException("User is not registered!");

        if(await this.OrderQueries.CheckOrderStatusById(id,user.id))
            throw new BadRequestException("Cannot cancel completed order!");
        
        return await this.OrderQueries.CancelOrderById(id,user.id);
    }

}