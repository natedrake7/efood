import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";
import { ProductAddon } from "./product_addon.entity";

@Entity('ProductRLAddon')
export class ProductRLAddon{
    @PrimaryGeneratedColumn('uuid')
    id : string;

    @ManyToOne(() => Product, (product) => product.productRLaddons)
    product: Product;

    @ManyToOne(() => ProductAddon, (productaddon) => productaddon.productRLaddons)
    addon: ProductAddon;
}