import { Entity, Column, PrimaryGeneratedColumn, ManyToMany,JoinTable } from 'typeorm';
import { Product } from './product.entity';

@Entity('ProductAddon')
export class ProductAddon{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    price: number;

    @ManyToMany(() => Product)
    @JoinTable()
    products: Product[];
}