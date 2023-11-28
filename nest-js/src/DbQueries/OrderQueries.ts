import { InjectRepository } from "@nestjs/typeorm";
import { Order } from "src/Entities/order/order.entity";
import { OrderDto } from "src/Entities/order/orderDto.entity";
import { Repository } from "typeorm";
import { ProductQueries } from "./ProductQueries";
import { Product } from "src/Entities/products/product.entity";
import { AddressQueries } from "./AddressQueries";
import { Address } from "src/Entities/addresses/address.entity";

export class OrderQueries{
    constructor(@InjectRepository(Order)
                private OrderRepository: Repository<Order>,
                private readonly ProductQueries: ProductQueries,
                private readonly AddressQueries: AddressQueries){}

    async CreateOrder(completeproducts: {ID :string ,addonsID :string[] }[],professionalId : string,user_id: string,orderDto: OrderDto,addressId : string):Promise<void>{
       
        const insertClauses: string[] = [];
        const values:any[] = [orderDto.professionalName,
                              orderDto.price,
                              orderDto.payment_method,
                              user_id,
                              professionalId,
                              addressId
                            ];
        completeproducts.forEach(product =>{
            insertClauses.push(`((SELECT OrderId FROM UserOrder), $${values.length + 1})`);
            values.push(product.ID);
        });
       
        const query = `WITH UserOrder AS (
            INSERT INTO "Order"(
                "professionalName", price, payment_method, "date", "userId",
                "professionalUserId", completed_status, "addressId"
            )
            VALUES (
                $1, $2, $3, CURRENT_TIMESTAMP, $4, $5, FALSE, $6
            )
            RETURNING id AS OrderId
        ),
        OrderItem AS (
            INSERT INTO "OrderItem"(
                "orderId", "productId"
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
       const AddonsQuery = `INSERT INTO "order_item_addons_product_addon"(
        "orderItemId","productAddonId"
        )
        VALUES ${AddonClauses.join(`,`)};`;

        return await this.OrderRepository.query(AddonsQuery,AddonValues);
    }

    async GetOrderById(id: string,user_id : string):Promise<Order>{
        const Orderquery = `SELECT id,"professionalName",price,payment_method,"date",completed_status,"addressId" 
                            FROM "Order" 
                            WHERE id = $1 AND "userId" = $2 
                            LIMIT 1;`;

        const order = (await this.OrderRepository.query(Orderquery,[id,user_id]))[0] as Order;

        const ProductsQuery = `SELECT "productId" as id,name,size,price,type,description FROM "OrderItem" AS oa
                                INNER JOIN "Product" AS pr ON pr.id = oa."productId"
                                WHERE oa."orderId" = $1;`;
        const AddonsQuery = `WITH ProductRLAddon AS (
                                SELECT "productAddonId" 
                                FROM "product_addon_products_product"
                                WHERE "productId" = $1
                            )
                            SELECT pa.id, pa.name, pa.price
                            FROM ProductRLAddon prla
                            INNER JOIN "ProductAddon" pa ON pa.id = prla."productAddonId";`;

        order.products = await this.OrderRepository.query(ProductsQuery,[order.id]) as Product[];
        
        for (const product of order.products)
            product.addons = await this.OrderRepository.query(AddonsQuery, [product.id]);
        
        order.address = await this.AddressQueries.GetAddressById(order.addressId,user_id);

        return order;
    }
}