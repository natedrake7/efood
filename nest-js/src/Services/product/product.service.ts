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
import { ProductQueries } from "src/DbQueries/ProductQueries";

@Injectable()
export class ProductService{
    constructor( 
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        @InjectRepository(ProductAddon)
        private addonRepository: Repository<ProductAddon>,
        private dataSource: DataSource,
        private readonly Queries: ProductQueries){}

    async Create( product : ProductDto,addons : ProductAddonDto[],user_id: string,IsUserProfessional:boolean = true):Promise<void>{
        return await this.Queries.CreateProductWithAddons(user_id,product,addons,IsUserProfessional);
    }

    async GetAllProducts(id: string,IsUserProfessional:boolean = true):Promise<void | Product[]>{
        const products = await this.Queries.GetProductsByUserId(id,IsUserProfessional);
        if(!products)
            throw new UnauthorizedException("User doesn't have any products!");
        return products;
    }

    async GetProductById(user_id: string,id: string,IsUserProfessional:boolean = true):Promise<void | Product>{
        const product = await this.Queries.GetProductById(user_id,id,IsUserProfessional);

        if(!product)
            throw new UnauthorizedException("Invalid product!");

        return product;
    }

    async EditProductById(product : ProductDto,user_id: string,id: string,IsUserProfessional:boolean = true):Promise<void>{
        return await this.Queries.UpdateProductById(product,user_id,id,IsUserProfessional);
    }

    async DeleteProductById(id: string,user_id: string,IsUserProfessional:boolean = true):Promise<void>{
        return await this.Queries.DeleteProductById(id,user_id,IsUserProfessional);
    }

    async ProfessionalAddonEdit(id: string,user:ProfessionalUser,addonDto : ProductAddonDto):Promise<void>{
        const addon = await this.addonRepository.findOneBy([{id,professionalUser:user}]);
        if(!addon)
            throw new UnauthorizedException("Addon doesn't exist!");
        if(addon.name != addonDto.name && addonDto.name != null)
            addon.name = addonDto.name;
        if(addon.price != addonDto.price && addonDto.price != null)
            addon.price = addonDto.price;
        await this.addonRepository.save(addon);
    }

    async FranchiseAddonEdit(id: string,user:FranchiseUser,addonDto : ProductAddonDto):Promise<void>{
        const addon = await this.addonRepository.findOneBy([{id,franchiseUser:user}]);
        if(!addon)
            throw new UnauthorizedException("Addon doesn't exist!");
        if(addon.name != addonDto.name && addonDto.name != null)
            addon.name = addonDto.name;
        if(addon.price != addonDto.price && addonDto.price != null)
            addon.price = addonDto.price;
        await this.addonRepository.save(addon);
    }

    async GetAddonById(id: string,user_id: string,IsUserProfessional:boolean = true):Promise<void | ProductAddon>{
        const addon = await this.Queries.GetAddonById(id,user_id,IsUserProfessional);
        if(!addon)
            throw new UnauthorizedException("Addon doesn't exist!");
        return addon;
    }

    async ProfessionalAddonDelete(id: string,user: ProfessionalUser):Promise<void>{
        const addon = await this.addonRepository.findOneBy([{id,professionalUser:user}])
        if(!addon)
            throw new UnauthorizedException("Addon doesn't exist!");
        await this.addonRepository.delete(addon);
    }

    async FranchiseAddonDelete(id: string,user: FranchiseUser):Promise<void>{
        const addon = await this.addonRepository.findOneBy([{id,franchiseUser:user}])
        if(!addon)
            throw new UnauthorizedException("Addon doesn't exist!");
        await this.addonRepository.delete(addon);
    }

    async GetCommericalProductsByUserId(id: string):Promise<Product[]>{
        return await this.Queries.GetCommercialProductsByUserId(id);
    }

    async GetCommercialProductById(id : string):Promise<Product>{
        return await this.Queries.GetCommercialProductById(id);
    }
}