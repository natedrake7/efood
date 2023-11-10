import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";
import { Order } from "../order/order.entity";

@Entity('Address')
export class Address{
    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column()
    address: string;

    @Column()
    number : string;

    @Column()
    zipcode : string;

    @Column()
    city: string;

    @Column()
    phonenumber: string;

    @Column()
    ringbell: string;

    @Column()
    floor : number;

    @ManyToOne(() => User,(user) => user.addresses)
    user: User;

    @OneToMany(() => Order,(order) => order.address)
    orders: Order[];
}