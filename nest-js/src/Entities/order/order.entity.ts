import { Entity, Column, PrimaryGeneratedColumn, ManyToOne ,OneToMany} from 'typeorm';
import { User } from '../user/user.entity';
import { ProfessionalUser } from '../professional_user/professionaluser.entity';
import { Address } from '../addresses/address.entity';
import { OrderItem } from './order_item.entity';
import { Product } from '../products/product.entity';

@Entity('Order')
export class Order{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({length: 100})
    professionalName: string;

    @Column()
    price: number;

    @Column({length: 100})
    payment_method: string;

    @Column()
    completed_status: boolean;

    @Column()
    date: Date;

    @ManyToOne(() => User,(user) => user.orders)
    user: User;

    @ManyToOne(() => ProfessionalUser,(professionalUser) => professionalUser.orders)
    professionalUser: ProfessionalUser;

    @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
    items: OrderItem[];

    @ManyToOne(() => Address,(address) => address.orders,{eager: true})
    address: Address;
}