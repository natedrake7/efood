import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ProductAddon } from "src/Entities/products/product_addon.entity";
import { ProductAddonDto } from "src/Entities/products/addonDto.entity";
import { ProductDto } from "src/Entities/products/productDto.entity";
import { Product } from "src/Entities/products/product.entity";
import { ProductQueries } from "src/DbQueries/ProductQueries";
import { BadRequestException } from "@nestjs/common/exceptions";
import * as fs from 'fs';

@Injectable()
export class ProductService{
    constructor(private readonly Queries: ProductQueries){}

    async Create( product : ProductDto,addons : ProductAddonDto[],user_id: string,file: string,IsUserProfessional:boolean = true):Promise<void>{
        return await this.Queries.CreateProductWithAddons(user_id,product,addons,file,IsUserProfessional);
    }

    async GetAllProducts(id: string,IsUserProfessional:boolean = true):Promise<void | Product[]>{
        const products = await this.Queries.GetProductsByUserId(id,IsUserProfessional);
        if(!products)
            throw new BadRequestException("User doesn't have any products!");
        return products;
    }

    async GetProductById(user_id: string,id: string,IsUserProfessional:boolean = true):Promise<void | Product>{
        const product = await this.Queries.GetProductById(user_id,id,IsUserProfessional);

        if(!product)
            throw new BadRequestException("Invalid product!");

        return product;
    }

    async EditProductById(product : ProductDto,user_id: string,id: string,IsUserProfessional:boolean = true):Promise<void>{
        return await this.Queries.UpdateProductById(product,user_id,id,IsUserProfessional);
    }

    async EditProductImageById(id: string, user_id: string,file: string,IsUserProfessional:boolean = true):Promise<void>{
        const {previous_image} = await this.Queries.EditProductImageById(id,user_id,file,IsUserProfessional);

        if(!fs.existsSync(previous_image))
            return;
        try{
            fs.unlinkSync(previous_image);
        }
        catch(error){
            throw new BadRequestException(error);
        }
    }

    async DeleteProductById(id: string,user_id: string,IsUserProfessional:boolean = true):Promise<void>{
        return await this.Queries.DeleteProductById(id,user_id,IsUserProfessional);
    }

    async EditAddonById(id: string,user_id: string,addonDto : ProductAddonDto,IsUserProfessional: boolean = true):Promise<void>{
        return await this.Queries.EditAddonById(id,user_id,IsUserProfessional,addonDto);
    }

    async GetAddonById(id: string,user_id: string,IsUserProfessional:boolean = true):Promise<void | ProductAddon>{
        const addon = await this.Queries.GetAddonById(id,user_id,IsUserProfessional);
        if(!addon)
            throw new BadRequestException("Addon doesn't exist!");
        return addon;
    }

    async DeleteAddonById(id: string,user_id: string,IsUserProfessional: boolean = true):Promise<void>{
        return await this.Queries.DeleteAddonById(id,user_id,IsUserProfessional);
    }

    async GetCommericalProductsByUserId(id: string):Promise<Product[]>{
        return await this.Queries.GetCommercialProductsByUserId(id);
    }

    async GetCommercialProductById(id : string):Promise<Product>{
        return await this.Queries.GetCommercialProductById(id);
    }
}