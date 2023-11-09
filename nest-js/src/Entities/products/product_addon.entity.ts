import { Entity, Column, PrimaryGeneratedColumn, ManyToMany,JoinTable } from 'typeorm';
import { Product } from './product.entity';

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
}