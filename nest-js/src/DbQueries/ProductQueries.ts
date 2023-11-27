import { UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { query } from "express";
import { ProductAddonDto } from "src/Entities/products/addonDto.entity";
import { Product } from "src/Entities/products/product.entity";
import { ProductDto } from "src/Entities/products/productDto.entity";
import { ProductAddon } from "src/Entities/products/product_addon.entity";
import { User } from "src/Entities/user/user.entity";
import { DataSource } from "typeorm";

export class ProductQueries{
    constructor(@InjectRepository(Product)
                private ProductRepository: DataSource){}
    async CreateProductWithAddons(id : string,productDto: ProductDto,addonsDto: ProductAddonDto[],IsUserProfessional: boolean):Promise<void>{
        const clauses = [];
        const values = [productDto.name,
            productDto.size,
            productDto.price,
            productDto.type,
            productDto.description,
            productDto.availability,
            id
            ];

        var UserClause: string = `"userId"`;
        var UserAddonClause: string = `"professionalUserId"`;
        if(!IsUserProfessional)
        {
            UserClause = `"franchiseUserId"`;
            UserAddonClause = `"franchiseUserId"`;
        }
        var QueryConnector: string = `,`;
        var CreateProductQuery:string = `WITH Product AS (
            INSERT INTO "Product"(
                name, size, price, type, description, availability, ${UserClause}
            )
            VALUES (
                $1, $2, $3, $4, $5, $6, $7
            )
            RETURNING id as ProductId
        )`;
        if(addonsDto.length == 0)
        {
            QueryConnector = `SELECT ProductId FROM Product;`;
            CreateProductQuery += QueryConnector;
            await this.ProductRepository.query(CreateProductQuery,values);
            return;
        }

        CreateProductQuery += QueryConnector;

        addonsDto.forEach(addon =>{
            clauses.push(`($${values.length + 1},$${values.length + 2},$7)`);
            values.push(addon.name);
            values.push(addon.price);
        });

        const CreateProductWithAddons = `
            ${CreateProductQuery}
            Addon AS (
                INSERT INTO "ProductAddon"(
                    name, price, ${UserAddonClause}
                )
                VALUES ${clauses.join(`,`)}
                RETURNING id as AddonId
            ),
            ProductRLAddon AS (
                INSERT INTO "product_addon_products_product"("productAddonId", "productId")
                SELECT AddonId, ProductId FROM Addon, Product
                RETURNING "productId"
            )SELECT * FROM ProductRLAddon;`;
        await this.ProductRepository.query(CreateProductWithAddons,values);
        return;
    }

    async GetProductsByUserId(id : string,IsUserProfessional: boolean = true):Promise<Product[]>{
        var UserClause:string = "";
        if(IsUserProfessional)
            UserClause = `"userId"`;
        else
            UserClause = `"franchiseUserId"`;

        const query = `SELECT id,name,size,price,type,description,availability 
                       FROM "Product" 
                       WHERE ${UserClause} = $1`;
        return (await this.ProductRepository.query(query,[id]));
    }

    async GetCommercialProductsByUserId(id : string):Promise<Product[]>{
        const query = `SELECT id,name,size,price,type,description,availability FROM "Product"
                       WHERE "userId" = $1 OR "franchiseUserId" = $1;`;
        return await this.ProductRepository.query(query,[id]);
    }

    async GetCommercialProductById(id : string):Promise<Product>{
        const Productquery = `SELECT id,name,size,price,type,description,availability
                              FROM "Product"
                              WHERE id = $1 LIMIT 1;`;
        const product = (await this.ProductRepository.query(Productquery,[id]))[0];
        const AddonsQuery = `
            WITH ProductRLAddon AS (
            SELECT "productAddonId" 
            FROM "product_addon_products_product"
            WHERE "productId" = $1
            )
            SELECT pa.id, pa.name, pa.price
            FROM ProductRLAddon prla
            INNER JOIN "ProductAddon" pa ON pa.id = prla."productAddonId";`;
        product.Addons = (await this.ProductRepository.query(AddonsQuery,[product.id]));
        return product;
    }

    async GetProductById(user_id : string,id : string,IsUserProfessional: boolean = true):Promise<Product>{
        var UserClause = this.GetUserClause(IsUserProfessional);
        const Productquery = `SELECT id,name,size,price,type,description,availability
                       FROM "Product"
                       WHERE ${UserClause} = $1 AND id = $2 LIMIT 1;`;
        const product = (await this.ProductRepository.query(Productquery,[user_id,id]))[0];
        const AddonsQuery = `
            WITH ProductRLAddon AS (
                SELECT "productAddonId" 
                FROM "product_addon_products_product"
                WHERE "productId" = $1
            )
            SELECT pa.id, pa.name, pa.price
            FROM ProductRLAddon prla
            INNER JOIN "ProductAddon" pa ON pa.id = prla."productAddonId";`;
        product.Addons = (await this.ProductRepository.query(AddonsQuery,[product.id]));
        return product;         
    }

    async UpdateProductById(product: ProductDto,user_id: string,id: string,IsUserProfessional: boolean = true):Promise<void>{
        const userClause = this.GetUserClause(IsUserProfessional);
        const clauses = [];
        const values:any[] = [id,user_id];
        if(product.name != null)
        {
            clauses.push(`name = $${values.length + 1}`);
            values.push(product.name);
        }
        if(product.price != null)
        {
            clauses.push(`price = $${values.length + 1}`);
            values.push(product.price);
        }
        if(product.size != null)
        {
            clauses.push(`size = $${values.length + 1}`);
            values.push(product.size);
        }
        if(product.type != null)
        {
            clauses.push(`type = $${values.length + 1}`);
            values.push(product.type);
        }
        if(product.description != null)
        {
            clauses.push(`description = $${values.length + 1}`);
            values.push(product.description);
        }
        if(product.availability != null)
        {
            clauses.push(`availability = $${values.length + 1}`);
            values.push(product.availability);
        }
        if(values.length == 2)
            throw new UnauthorizedException("Please make some changes before submitting!");

        const query = `
            UPDATE "Product"
            SET ${clauses.join(`,`)}
            WHERE id = $1 AND ${userClause} = $2`;

        return await this.ProductRepository.query(query,values);
    }

    async GetAddonById(id: string,user_id: string,IsUserProfessional:boolean):Promise<ProductAddon>{
        const userClause = this.GetUserClause(IsUserProfessional);
        const query = `SELECT id,name,price FROM "ProductAddon"
                       WHERE id = $1 AND ${userClause} = $2 LIMIT 1;`;
        return (await this.ProductRepository.query(query,[id,user_id]))[0];
    }

    async DeleteProductById(id: string,user_id: string,IsUserProfessional = true):Promise<void>{
        const userClause = this.GetUserClause(IsUserProfessional);

        const query = `WITH Product as(
            DELETE  FROM "Product"
            WHERE id = $1 AND ${userClause} = $2
            RETURNING id
        ),
        ProductRLAddon as(
            DELETE FROM "product_addon_products_product"
            WHERE "productId" = $1
            RETURNING "productAddonId"
        )SELECT * FROM ProductRLAddon;`

        return await this.ProductRepository.query(query,[id,user_id]);
    }

    GetUserClause(IsUserProfessional: boolean = true):string{
        if(IsUserProfessional)
            return `"userId"`;
        else
            return `"franchiseUserId"`;
    }

    GetCreateUpdateUserClause(IsUserProfessional: boolean = true):string[]{
        if(IsUserProfessional)
            return [`"userId"`,`"professionalUserId"`];
        else
            return [`"franchiseUserId"`,`"franchiseUserId"`];
    }
}