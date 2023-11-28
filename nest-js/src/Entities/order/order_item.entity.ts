import { Entity, PrimaryGeneratedColumn, ManyToOne,Column,ManyToMany,JoinTable, OneToMany } from 'typeorm';
import { ProductAddon } from '../products/product_addon.entity';
import { Order } from '../order/order.entity';
import { Product } from '../products/product.entity';
import { OrderItemRLProductAddon } from './order_item_rl_product_addon';

@Entity('OrderItem')
export class OrderItem{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Order, (order) => order.items)
    order: Order;

    @ManyToOne(() => Product)
    product: Product;

    @OneToMany(() => OrderItemRLProductAddon,(orderitemRLproductaddon) => orderitemRLproductaddon.items)
    orderitemRLproductaddon: OrderItemRLProductAddon[];
}