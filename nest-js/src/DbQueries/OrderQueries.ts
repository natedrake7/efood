import { InjectRepository } from "@nestjs/typeorm";
import { Order } from "src/Entities/order/order.entity";
import { OrderDto } from "src/Entities/order/orderDto.entity";
import { Repository } from "typeorm";
import { Product } from "src/Entities/products/product.entity";
import { AddressQueries } from "./AddressQueries";

export class OrderQueries{
    constructor(@InjectRepository(Order)
                private OrderRepository: Repository<Order>,
                private readonly AddressQueries: AddressQueries){}

    async CreateOrder(completeproducts: {ID :string,count: number,size:string,addonsID :string[] }[],professionalId : string,user_id: string,orderDto: OrderDto,addressId : string):Promise<void>{
       
        const insertClauses: string[] = [];
        const values:any[] = [orderDto.professionalName,
                              orderDto.price,
                              orderDto.payment_method,
                              user_id,
                              professionalId,
                              addressId
                            ];

        completeproducts.forEach(product =>{
            insertClauses.push(`((SELECT OrderId FROM UserOrder), $${values.length + 1},$${values.length + 2},$${values.length + 3})`);
            values.push(product.ID);
            values.push(product.count);
            values.push(product.size);
        });
       
        const query = `WITH UserOrder AS (
            INSERT INTO "Order"(
                "professionalName", price, payment_method, "insertedDate", "userId",
                "professionalUserId", completed_status, "addressId"
            )
            VALUES (
                $1, $2, $3, CURRENT_TIMESTAMP, $4, $5, FALSE, $6
            )
            RETURNING id AS OrderId
        ),
        OrderItem AS (
            INSERT INTO "OrderItem"(
                "orderId", "productId",number,size
            )
            VALUES ${insertClauses.join(`,`)}
            RETURNING id  AS OrderItemId ,"productId"
        )SELECT * FROM OrderItem;`

        const AddonValues: any[] = [];
        const AddonClauses: string[] = [];
        const ids = await this.OrderRepository.query(query,values);
        for(let i = 0; i < ids.length ; i++)
        {
            const {orderitemid , productid} = ids[i];
            if(completeproducts[i].addonsID.length != 0)
            {
                completeproducts[i].addonsID.forEach(addon => {
                    AddonClauses.push(`($${AddonValues.length + 1},$${AddonValues.length + 2})`);
                    AddonValues.push(orderitemid);
                    AddonValues.push(addon)
                });
            }
        }
        if(AddonClauses.length == 0)
            return;
       const AddonsQuery = `INSERT INTO "OrderItemRLProductAddon"(
        "itemId","addonId"
        )
        VALUES ${AddonClauses.join(`,`)};`;

        return await this.OrderRepository.query(AddonsQuery,AddonValues);
    }

    async UpdateOrderAsCompletedById(id : string, user_id: string):Promise<void>{
        const query = `UPDATE "Order"
                       SET "completedDate" = CURRENT_TIMESTAMP, completed_status = TRUE
                       WHERE id = $1 AND "professionalUserId" = $2;`;

        return await this.OrderRepository.query(query,[id,user_id]);
    }

    async GetAllOrdersByUserId(user_id: string,IsUserProfessional: boolean):Promise<Order[]>
    {
        const userClause = this.UserClause(IsUserProfessional);
        const query = `SELECT id,"professionalName",image,price,payment_method,"insertedDate","completedDate",completed_status 
                       FROM "Order" 
                       WHERE ${userClause} = $1;`;
        return await this.OrderRepository.query(query,[user_id]);
    }

    async GetOrderById(id: string,user_id : string,IsUserProfessional:boolean):Promise<Order>{
        const userClause = this.UserClause(IsUserProfessional);

        const Orderquery = `SELECT id,"professionalName","userId",price,payment_method,"insertedDate","completedDate",completed_status,"addressId" 
                            FROM "Order" 
                            WHERE id = $1 AND ${userClause} = $2 
                            LIMIT 1;`;

        const order = (await this.OrderRepository.query(Orderquery,[id,user_id]))[0] as Order;

        const ProductsQuery = `SELECT "productId" as id, pr.name,pr.image, oa.size, pr.price, pr.type, pr.description, oa.number FROM "OrderItem" AS oa
                                INNER JOIN "Product" AS pr ON pr.id = oa."productId"
                                WHERE oa."orderId" = $1;`;
        const AddonsQuery = `WITH ProductRLAddon AS (
                                SELECT "addonId" 
                                FROM "ProductRLAddon"
                                WHERE "productId" = $1
                            )
                            SELECT pa.id, pa.name, pa.price
                            FROM ProductRLAddon prla
                            INNER JOIN "ProductAddon" pa ON pa.id = prla."addonId";`;

        order.products = await this.OrderRepository.query(ProductsQuery,[order.id]) as Product[];
        
        for (const product of order.products)
            product.addons = await this.OrderRepository.query(AddonsQuery, [product.id]);
        
        order.address = await this.AddressQueries.GetAddressById(order.addressId,order.userId);
        order.addressId = null;
        order.userId = null;
        return order;
    }

    async CancelOrderById(id : string, user_id : string):Promise<void>{
        const query = `UPDATE "Order"
                       SET "cancelledStatus" = TRUE AND "completed_status" = TRUE AND "completedDate" = CURRENT_TIMESTAMP
                       WHERE id = $1 AND "userId" = $2;`;
        return await this.OrderRepository.query(query,[id,user_id]);
    }

    async CheckOrderStatusById(id : string, user_id : string):Promise<boolean>{
        const query = `SELECT "completed_status" FROM "Order"
                       WHERE id = $1 AND "userId" = $2 LIMIT 1;`;

        return (await this.OrderRepository.query(query,[id,user_id]))[0];
    }

    UserClause(IsUserProfessional: boolean):string{
        if(IsUserProfessional)
            return `"professionalUserId"`;
        else
            return `"userId"`;
    }
}