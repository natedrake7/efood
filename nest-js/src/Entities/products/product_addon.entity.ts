import { Entity, Column, PrimaryGeneratedColumn, ManyToMany,JoinTable,OneToMany, ManyToOne } from 'typeorm';
import { Product } from './product.entity';
import { ProfessionalUser } from '../professional_user/professionaluser.entity';
import { FranchiseUser } from '../franchise_user/franchise_user.entity';

@Entity('ProductAddon')
export class ProductAddon{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    price: number;

    @ManyToMany(() => Product)
    @JoinTable()
    products: Product[];

    @ManyToOne(() => ProfessionalUser,(professionalUser) => professionalUser.addons)
    professionalUser: ProfessionalUser;

    @ManyToOne(() => FranchiseUser,(franchiseUser) => franchiseUser.addons)
    franchiseUser: FranchiseUser;
}