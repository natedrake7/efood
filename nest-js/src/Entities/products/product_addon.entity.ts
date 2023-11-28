import { Entity, Column, PrimaryGeneratedColumn, ManyToMany,JoinTable,OneToMany, ManyToOne } from 'typeorm';
import { Product } from './product.entity';
import { ProfessionalUser } from '../professional_user/professionaluser.entity';
import { FranchiseUser } from '../franchise_user/franchise_user.entity';
import { OrderItemRLProductAddon } from '../order/order_item_rl_product_addon';
import { ProductRLAddon } from './product_rl_addon';

@Entity('ProductAddon')
export class ProductAddon{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    price: number;

    @ManyToOne(() => ProfessionalUser,(professionalUser) => professionalUser.addons)
    professionalUser: ProfessionalUser;

    @ManyToOne(() => FranchiseUser,(franchiseUser) => franchiseUser.addons)
    franchiseUser: FranchiseUser;

    @OneToMany(() => OrderItemRLProductAddon,(orderitemRLproductaddon) => orderitemRLproductaddon.addons)
    orderitemRLproductaddon : OrderItemRLProductAddon[];

    @OneToMany(() => ProductRLAddon, (productRLaddon) => productRLaddon.addon)
    productRLaddons: ProductRLAddon[];
}