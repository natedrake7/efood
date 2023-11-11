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
                private dataSource: DataSource){}
    
    async Create(user: User,orderDto: OrderDto,professionalID: string,completeproducts: {ID :string,addonsID :string[]}[],addressID: string):Promise<void>{
        const professionalUser = await this.ProfessionalRepository.findOneBy({id:professionalID});
        if(!professionalUser)
            throw new UnauthorizedException("User doesn't exist!");

        const {professionalName,price,payment_method,completed_status,date} = orderDto;

        const address = await this.AddressRepository.findOneBy({id:addressID,user});
        if(!address)
            throw new UnauthorizedException("Invalid address!");

        var error:string = "no error";
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
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        
        await queryRunner.startTransaction();
    
        try {
          const orderDb = await queryRunner.manager.save(Order, order);
          var addonsArray: ProductAddon[] = [];
        
          for (const product of completeproducts) {
            const productDb = await this.ProductRepository.findOneBy({ id: product.ID });
            if (!productDb) {
              error = "No product with that ID exists!";
              throw new Error("No product with that ID exists!");
            }
        
            for (const addonId of product.addonsID) {
              const addonDb = await this.AddonRepository.findOneBy({ id: addonId });
              if (!addonDb) {
                error = "No addon with that ID exists!";
                throw new Error("No product addon with that ID exists!");
              }
              addonsArray.push(addonDb);
            }
        
            const orderItem = await this.OrderItemRepository.create({
              product: productDb,
              order: orderDb,
              addons: addonsArray
            });
            await queryRunner.manager.save(OrderItem, orderItem);
            addonsArray = [];
          }
          await queryRunner.commitTransaction();
        } catch (error){
          await queryRunner.rollbackTransaction();
          throw new UnauthorizedException(error);
        } finally {
          await queryRunner.release();
        }
        
    }

    async GetUserOrderById(id: string,user: User):Promise<void | OrderReturnDto>{
        const order = await this.OrderRepository.findOneBy({id,user});
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