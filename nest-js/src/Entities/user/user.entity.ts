import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany, ManyToOne} from 'typeorm';
import { Address } from '../addresses/address.entity';
import { Order } from '../order/order.entity';

@Entity('User')
export class User{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({length: 100})
    username: string;

    @Column({length: 100})
    firstname: string;

    @Column({length: 100})
    lastname: string;

    @Column({length: 100})
    password: string;

    @Column({length: 100})
    email: string;

    @Column()
    phonenumber: string;

    @OneToMany(() => Address, (address) => address.user)
    addresses: Address[];

    @ManyToOne(() => Order, (order) => order.user)
    orders: Order[];
}