import { Entity, Column, PrimaryGeneratedColumn, ManyToOne,ManyToMany,OneToMany } from 'typeorm';
import { ProductAddon } from './product_addon.entity';
import { ProfessionalUser } from '../professional_user/professionaluser.entity';
import { FranchiseUser } from '../franchise_user/franchise_user.entity';
import { OrderProductAddon } from '../order/order_product_addon.entity';

@Entity('Product')
export class Product{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({length: 100})
    name: string;

    @Column({length: 100})
    size: string;

    @Column()
    price: number;

    @Column({length:10})
    type: string;

    @Column({length:500})
    description: string;

    @Column()
    availability: boolean;

    @ManyToMany(() => ProductAddon,productAddon => productAddon.products)
    addons: ProductAddon[];

    @ManyToOne(() => ProfessionalUser,(user) => user.products)
    user: ProfessionalUser;

    @ManyToOne(() => FranchiseUser,(franchiseUser) => franchiseUser.professionalUsers)
    franchiseUser: FranchiseUser;

    @OneToMany(() => OrderProductAddon, (orderProductAddon) => orderProductAddon.product)
    orderProductAddons: OrderProductAddon[];
}
