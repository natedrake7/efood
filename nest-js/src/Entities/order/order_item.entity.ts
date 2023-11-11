import { Entity, PrimaryGeneratedColumn, ManyToOne,Column,ManyToMany,JoinTable } from 'typeorm';
import { ProductAddon } from '../products/product_addon.entity';
import { Order } from '../order/order.entity';
import { Product } from '../products/product.entity';

@Entity('OrderItem')
export class OrderItem{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Order, (order) => order.items)
    order: Order;

    @ManyToOne(() => Product,{eager: true})
    product: Product;
  
    @ManyToMany(() => ProductAddon,{eager:true})
    @JoinTable()
    addons: ProductAddon[];
}