import { Controller,Get,Post,Body,UseGuards,Param } from "@nestjs/common";
import { GetUser } from "src/get-user.decorator";
import { UserGuard } from "src/Guards/user.guard";
import { OrderService } from "src/Services/order/order.service";
import { OrderDto } from "src/Entities/order/orderDto.entity";
import { User } from "src/Entities/user/user.entity";
import { ProfessionalUser } from "src/Entities/professional_user/professionaluser.entity";
import { ProfessionalGuard } from "src/Guards/professional.guard"
import { Order } from "src/Entities/order/order.entity";

@Controller('order')
export class OrdersController{
    constructor(private readonly orderService :OrderService){}

    @Post('user/create')
    @UseGuards(UserGuard)
    async Create(@Body() body: {orderDto : OrderDto,professionalID : string,completeproducts: {ID :string,count: number,addonsID :string[]}[],addressID : string},
                @GetUser() user: User):Promise<void>
    {
        return this.orderService.Create(user,body.orderDto,body.professionalID,body.completeproducts,body.addressID);
    }

    @Get('user/get/:id')
    @UseGuards(UserGuard)
    async GetUserOrderById(@Param('id') id: string,@GetUser() user: User):Promise<Order>
    {
        return this.orderService.GetOrderById(id,user);
    }

    @Get('user/get')
    @UseGuards(UserGuard)
    async GetAllUserOrders(@GetUser() user: User):Promise<void | Order[]>
    {
        return this.orderService.GetAllUserOrders(user);
    }

    @Post('user/cancel/:id')
    @UseGuards(UserGuard)
    async CancelOrder(@Param('id') id: string,@GetUser() user: User):Promise<void>
    {
        return await this.orderService.CancelOrder(id,user);
    }

    @Get('professional/get/:id')
    @UseGuards(ProfessionalGuard)
    async GetProfessionalOrderById(@Param('id') id: string,@GetUser() user: ProfessionalUser):Promise<Order>
    {
        return this.orderService.GetOrderById(id,user,true);
    }

    @Post('professional/update/:id')
    @UseGuards(ProfessionalGuard)
    async UpdateProfessionalOrderById(@Param('id') id: string,@GetUser() user: ProfessionalUser):Promise<void>
    {
        return await this.orderService.UpdateProfessionalOrderById(id,user);
    }

    @Get('professional/get')
    @UseGuards(ProfessionalGuard)
    async GetAllProfessionalOrders(@GetUser() user: ProfessionalUser):Promise<Order[]>
    {
        return this.orderService.GetAllUserOrders(user,true);
    }



}