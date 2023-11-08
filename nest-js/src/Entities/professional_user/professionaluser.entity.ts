import { Entity, Column, PrimaryGeneratedColumn,OneToMany, ManyToOne } from 'typeorm';
import { Product } from './product.entity';
import { FranchiseUser } from '../franchise_user/franchise_user.entity';

@Entity('ProfessionalUser')
export class ProfessionalUser{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({length:100})
    username: string;

    @Column({length: 100})
    address: string;

    @Column({length: 100})
    city: string;

    @Column({length: 100})
    zipcode: string;

    @Column()
    open_status: boolean;

    @Column({length:100})
    timetable: string;

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

    @ManyToOne(() => FranchiseUser,(franchise_user) => franchise_user.professionalUsers)
    franchise_user: FranchiseUser;
}