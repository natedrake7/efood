import { Entity, Column, PrimaryGeneratedColumn,ManyToMany,JoinTable, ManyToOne ,OneToMany} from 'typeorm';
import { Product } from '../products/product.entity';
import { User } from '../user/user.entity';
import { ProfessionalUser } from '../professional_user/professionaluser.entity';
import { Address } from '../addresses/address.entity';
import { OrderProductAddon } from './order_product_addon.entity';

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

    @OneToMany(() => OrderProductAddon, (orderProductAddon) => orderProductAddon.order)
    orderProductAddons: OrderProductAddon[];

    @ManyToOne(() => Address,(address) => address.orders)
    address: Address;
}