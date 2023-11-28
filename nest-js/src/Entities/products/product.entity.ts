import { Entity, Column, PrimaryGeneratedColumn, ManyToOne,ManyToMany,OneToMany } from 'typeorm';
import { ProductAddon } from './product_addon.entity';
import { ProfessionalUser } from '../professional_user/professionaluser.entity';
import { FranchiseUser } from '../franchise_user/franchise_user.entity';
import { ProductRLAddon } from './product_rl_addon';

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

    @Column()
    image: string;

    @OneToMany(() => ProductRLAddon,productRLaddon => productRLaddon.product)
    productRLaddons: ProductRLAddon[];

    @ManyToOne(() => ProfessionalUser,(user) => user.products)
    user: ProfessionalUser;

    @ManyToOne(() => FranchiseUser,(franchiseUser) => franchiseUser.professionalUsers)
    franchiseUser: FranchiseUser;

    productId?: string;

    addons?: ProductAddon[];
}
