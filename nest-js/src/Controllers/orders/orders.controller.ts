import { Controller,Get,Post,Body,UseGuards } from "@nestjs/common";
import { GetUser } from "src/get-user.decorator";
import { UserGuard } from "src/Guards/user.guard";
import { OrderService } from "src/Services/order/order.service";
import { OrderDto } from "src/Entities/order/orderDto.entity";
import { User } from "src/Entities/user/user.entity";

@Controller('user/order')
@UseGuards(UserGuard)
export class OrdersController{
    constructor(private readonly orderService :OrderService){}

    @Post('create')
    async Create(@Body() body: {orderDto : OrderDto,professionalID : string,completeproducts: {ID :string,addonsID :string[]}[],addressID : string},
                @GetUser() user: User):Promise<void>
    {
        return this.orderService.Create(user,body.orderDto,body.professionalID,body.completeproducts,body.addressID);
    }
}