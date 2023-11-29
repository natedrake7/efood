import { PrimaryGeneratedColumn, Entity, ManyToOne, OneToMany, Column } from "typeorm";
import { OrderItem } from "./order_item.entity";
import { ProductAddon } from "../products/product_addon.entity";

@Entity('OrderItemRLProductAddon')
export class OrderItemRLProductAddon{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => OrderItem,(orderitem) => orderitem.orderitemRLproductaddon)
    item: OrderItem;

    @ManyToOne(() => ProductAddon, (productaddon)=> productaddon.orderitemRLproductaddon)
    addon:  ProductAddon;
}