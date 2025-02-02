import { Entity, Column, PrimaryGeneratedColumn,OneToMany } from 'typeorm';
import { ProfessionalUser } from '../professional_user/professionaluser.entity';
import { Product } from '../products/product.entity';
import { ProductAddon } from '../products/product_addon.entity';

@Entity('FranchiseUser')
export class FranchiseUser{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({length:100})
    username: string;

    @Column()
    rating: number;

    @Column({length: 100})
    password: string;

    @Column({length: 100})
    email: string;

    @Column()
    phonenumber: string;

    @Column({length:500})
    description: string;

    @Column()
    image: string;

    @OneToMany(() => ProfessionalUser, (professionalUser) => professionalUser.franchise_user)
    professionalUsers: ProfessionalUser[];
    
    @OneToMany(() => Product, (product) => product.franchiseUser)
    products: Product[];

    @OneToMany(() => ProductAddon,(productAddon) => productAddon.franchiseUser)
    addons: ProductAddon[];
}