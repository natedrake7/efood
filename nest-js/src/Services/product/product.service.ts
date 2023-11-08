import { Injectable } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { async } from "rxjs";
import { Product } from "src/Entities/products/product.entity";
import { ProductAddon } from "src/Entities/products/product_addon.entity";
import { ProfessionalUser } from "src/Entities/professional_user/professionaluser.entity";
import { EntityManager, Repository } from "typeorm";
import { ProductAddonDto } from "src/Entities/products/addonDto.entity";
import { ProductDto } from "src/Entities/products/productDto.entity";
import { DataSource } from "typeorm";
import { FranchiseUser } from "src/Entities/franchise_user/franchise_user.entity";

@Injectable()
export class ProductService{
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        @InjectRepository(ProductAddon)
        private addonRepository: Repository<ProductAddon>,
        private dataSource: DataSource){}

    async ProfessionalCreate( product : ProductDto,addons : ProductAddonDto[],user : ProfessionalUser){
        const {name , type , size , price , description, availability} = product;
        const new_product = this.productRepository.create({
            name,
            type,
            size,
            price,
            description,
            availability,
            user:user,
        });
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try{
            const item = await queryRunner.manager.save(Product,new_product);
            addons.forEach(async (addon) => {
                const { name , price } = addon;
                const new_addon = this.addonRepository.create({
                    name,
                    price,
                    products:[item],
                });
                await queryRunner.manager.save(ProductAddon,new_addon);
            });
            await queryRunner.commitTransaction();
        }catch(error) {
            await queryRunner.rollbackTransaction();
        }
    }
    async FranchiseCreate( product : ProductDto,addons : ProductAddonDto[],user : FranchiseUser){
        const {name , type , size , price , description, availability} = product;
        const new_product = this.productRepository.create({
            name,
            type,
            size,
            price,
            description,
            availability,
            franchiseUser:user,
        });
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try{
            const item = await queryRunner.manager.save(Product,new_product);
            addons.forEach(async (addon) => {
                const { name , price } = addon;
                const new_addon = this.addonRepository.create({
                    name,
                    price,
                    products:[item],
                });
                await queryRunner.manager.save(ProductAddon,new_addon);
            });
            await queryRunner.commitTransaction();
        }catch(error) {
            await queryRunner.rollbackTransaction();
        }
    }
}