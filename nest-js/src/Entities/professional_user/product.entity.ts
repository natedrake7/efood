import { Entity, Column, PrimaryGeneratedColumn,OneToMany, ManyToOne } from 'typeorm';
import { ProductAddon } from './product_addon.entity';
import { Order } from './order.entity';
import { ProfessionalUser } from './professionaluser.entity';
import { FranchiseUser } from '../franchise_user/franchise_user.entity';

@Entity('Product')
export class Product{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 100})
    name: string;

    @Column({length: 10})
    size: string;

    @Column()
    price: number;

    @Column({length:10})
    type: string;

    @Column({length:500})
    description: string;

    @Column()
    availability: boolean;

    @OneToMany(() => ProductAddon, (addon) => addon.product)
    addons: ProductAddon[];

    @ManyToOne(() => Order, (order) => order.products)
    order: Order;

    @ManyToOne(() => ProfessionalUser,(user) => user.products)
    user: ProfessionalUser;

    @ManyToOne(() => FranchiseUser,(franchiseUser) => franchiseUser.professionalUsers)
    franchiseUser: FranchiseUser;
}
