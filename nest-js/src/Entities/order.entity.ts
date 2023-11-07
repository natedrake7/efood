import { Entity, Column, PrimaryGeneratedColumn,OneToMany } from 'typeorm';
import { Product } from './product.entity';

@Entity('Order')
export class Order{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 100})
    restaurant: string;

    @Column({length: 100})
    deilvery_address: string;

    @Column()
    price: number;

    @Column({length: 100})
    payment_method: string;

    @Column()
    date: Date;

    @OneToMany(() => Product,(product) => product.order)
    products: Product[];
}