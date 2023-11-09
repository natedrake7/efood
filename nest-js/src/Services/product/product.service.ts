import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductAddon } from "src/Entities/products/product_addon.entity";
import { ProfessionalUser } from "src/Entities/professional_user/professionaluser.entity";
import { Repository } from "typeorm";
import { ProductAddonDto } from "src/Entities/products/addonDto.entity";
import { ProductDto } from "src/Entities/products/productDto.entity";
import { DataSource } from "typeorm";
import { FranchiseUser } from "src/Entities/franchise_user/franchise_user.entity";
import { Product } from "src/Entities/products/product.entity";

@Injectable()
export class ProductService{
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        @InjectRepository(ProductAddon)
        private addonRepository: Repository<ProductAddon>,
        private dataSource: DataSource){}

    async ProfessionalCreate( product : ProductDto,addons : ProductAddonDto[],user : ProfessionalUser):Promise<void>{
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

    async ProfessionalGetAll(user : ProfessionalUser):Promise<void | Product[]>{
        const products = await this.productRepository.findBy({user:user});
        if(!products)
            throw new UnauthorizedException("User doesn't have any products!");
        return products;
    }

    async ProfessionalGetProductById(user: ProfessionalUser,id: string):Promise<void | {product: Product,addons: ProductAddon[]}>{
        const product = await this.productRepository.findOneBy({id,user});
        if(!product)
            throw new UnauthorizedException("Invalid product!");
        const addons = await this.addonRepository.findBy({products:[product]});

        return {product,addons};
    }

    async ProfessionalProductEdit(product : ProductDto,user : ProfessionalUser,id: string):Promise<void>{
        const old_product = await this.productRepository.findOneBy({id,user});
        if(!old_product)
            throw new UnauthorizedException("Product doesn't exist!");

        if(old_product.name != product.name && product.name != null)
            old_product.name = product.name;
        if(old_product.type != product.type && product.type != null)
            old_product.type = product.type;
        if(old_product.size != product.size && product.size != null)
            old_product.size = product.size;
        if(old_product.price != product.price && product.price != null)
            old_product.price= product.price;
        if(old_product.description != product.description && product.description != null)
            old_product.description = product.description;
        if(old_product.availability != product.availability && product.availability != null)
            old_product.availability = product.availability;

        await this.productRepository.save(old_product);
    }

    async ProfessionalProductDelete(id: string,user : ProfessionalUser):Promise<void>{
        const product = await this.productRepository.findOneBy({id,user});
        if(!product)
            throw new UnauthorizedException("Product doesn't exist!");
        await this.productRepository.delete(id);
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

    async FranchiseGetAll(user : FranchiseUser):Promise<void | Product[]>{
        const products = await this.productRepository.findBy({franchiseUser:user});
        if(!products)
            throw new UnauthorizedException("User doesn't have any products!");
        return products;
    }

    async FranchiseGetProductById(user : FranchiseUser,id: string):Promise<void | {product: Product,addons: ProductAddon[]}>{
        const product = await this.productRepository.findOneBy({id,franchiseUser:user});
        if(!product)
            throw new UnauthorizedException("Invalid product!");
        const addons = await this.addonRepository.findBy({products:[product]});

        return {product,addons};
    }

    async FranchiseProductEdit(product : ProductDto,user : FranchiseUser,id: string):Promise<void>{
        const old_product = await this.productRepository.findOneBy({id,franchiseUser:user});
        if(!old_product)
            throw new UnauthorizedException("Product doesn't exist!");

        if(old_product.name != product.name && product.name != null)
            old_product.name = product.name;
        if(old_product.type != product.type && product.type != null)
            old_product.type = product.type;
        if(old_product.size != product.size && product.size != null)
            old_product.size = product.size;
        if(old_product.price != product.price && product.price != null)
            old_product.price= product.price;
        if(old_product.description != product.description && product.description != null)
            old_product.description = product.description;
        if(old_product.availability != product.availability && product.availability != null)
            old_product.availability = product.availability;

        await this.productRepository.save(old_product);
    }

    async FranchiseProductDelete(id: string,user : FranchiseUser):Promise<void>{
        const product = await this.productRepository.findOneBy({id,franchiseUser:user});
        if(!product)
            throw new UnauthorizedException("Product doesn't exist!");
        await this.productRepository.delete(id);
    }


    async AddonEdit(id: string,addonDto : ProductAddonDto):Promise<void>{
        const addon = await this.addonRepository.findOneBy([{id}])
        if(!addon)
            throw new UnauthorizedException("Addon doesn't exist!");
        if(addon.name != addonDto.name && addonDto.name != null)
            addon.name = addonDto.name;
        if(addon.price != addonDto.price && addonDto.price != null)
            addon.price = addonDto.price;
        await this.addonRepository.save(addon);
    }

    async AddonGet(id: string):Promise<void | ProductAddon>{
        const addon = await this.addonRepository.findOneBy([{id}])
        if(!addon)
            throw new UnauthorizedException("Addon doesn't exist!");
        return addon;
    }

    async AddonDelete(id: string):Promise<void>{
        const addon = await this.addonRepository.findOneBy([{id}])
        if(!addon)
            throw new UnauthorizedException("Addon doesn't exist!");
        await this.addonRepository.delete(addon);
    }
}