import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ProductAddon } from '../products/product_addon.entity';
import { Order } from '../order/order.entity';
import { Product } from '../products/product.entity';

@Entity('OrderProductAddon')
export class OrderProductAddon{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Order, (order) => order.orderProductAddons)
    order: Order;
  
    @ManyToOne(() => Product, (product) => product.orderProductAddons)
    product: Product;
  
    @ManyToOne(() => ProductAddon, (addon) => addon.orderProductAddons)
    addon: ProductAddon;
}