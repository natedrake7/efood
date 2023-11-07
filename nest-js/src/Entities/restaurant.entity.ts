import { Entity, Column, PrimaryGeneratedColumn,OneToMany, ManyToOne } from 'typeorm';
import { Product } from './product.entity';
import { User } from './user.entity';

@Entity('Restaurant')
export class Restaurant{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length:100})
    name: string;

    @Column({length: 100})
    address: string;

    @Column()
    rating: number;

    @Column()
    delivery_time: number;

    @OneToMany(() => Product, (product) => product.restaurant)
    products: Product[];

    @ManyToOne(() => User, (owner) => owner.restaurants)
    owner: User;
}