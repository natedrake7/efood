import { Entity, Column, PrimaryGeneratedColumn,OneToMany, ManyToOne } from 'typeorm';
import { Product } from './product.entity';
import { User } from '../user/user.entity';

@Entity('ProfessionalUser')
export class ProfessionalUser{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length:100})
    username: string;

    @Column({length: 100})
    address: string;

    @Column()
    rating: number;

    @Column()
    delivery_time: number;

    @Column({length: 100})
    password: string;

    @Column({length: 100})
    email: string;

    @Column()
    phonenumber: string;

    @Column({length:500})
    description: string;

    @OneToMany(() => Product, (product) => product.user)
    products: Product[];
}