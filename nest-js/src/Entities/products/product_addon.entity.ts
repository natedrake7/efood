import { Entity, Column, PrimaryGeneratedColumn, ManyToMany,JoinTable,OneToMany } from 'typeorm';
import { Product } from './product.entity';
import { OrderProductAddon } from '../order/order_product_addon.entity';

@Entity('ProductAddon')
export class ProductAddon{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    price: number;

    @ManyToMany(() => Product)
    @JoinTable()
    products: Product[];

    @OneToMany(() => OrderProductAddon, (orderProductAddon) => orderProductAddon.addon)
    orderProductAddons: OrderProductAddon[];
}