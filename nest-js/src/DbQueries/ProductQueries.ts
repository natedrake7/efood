import { UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductAddonDto } from "src/Entities/products/addonDto.entity";
import { Product } from "src/Entities/products/product.entity";
import { ProductDto } from "src/Entities/products/productDto.entity";
import { ProductAddon } from "src/Entities/products/product_addon.entity";
import { DataSource } from "typeorm";

export class ProductQueries{
    constructor(@InjectRepository(Product)
                private ProductRepository: DataSource){}
    async CreateProductWithAddons(id : string,productDto: ProductDto,addonsDto: ProductAddonDto[],file: string,IsUserProfessional: boolean):Promise<void>{
        const clauses = [];
        const values = [productDto.name,
            productDto.size,
            productDto.price,
            productDto.type,
            productDto.description,
            productDto.availability,
            id,
            file
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
                name, size, price, type, description, availability, ${UserClause} ,image
            )
            VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8
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
                INSERT INTO "ProductRLAddon"("addonId", "productId")
                SELECT AddonId, ProductId FROM Addon, Product
                RETURNING "productId"
            )SELECT * FROM ProductRLAddon;`;
        await this.ProductRepository.query(CreateProductWithAddons,values);
        return;
    }

    async GetProductsByUserId(id : string,IsUserProfessional: boolean):Promise<Product[]>{
        var UserClause:string = "";
        if(IsUserProfessional)
            UserClause = `"userId"`;
        else
            UserClause = `"franchiseUserId"`;

        const query = `SELECT id,name,size,price,type,description,availability,image
                       FROM "Product" 
                       WHERE ${UserClause} = $1`;
        return (await this.ProductRepository.query(query,[id]));
    }

    async GetCommercialProductsByUserId(id : string):Promise<Product[]>{
        const query = `SELECT id,name,size,price,type,description,availability,image FROM "Product"
                       WHERE "userId" = $1 OR "franchiseUserId" = $1;`;
        return await this.ProductRepository.query(query,[id]);
    }

    async GetCommercialProductById(id : string):Promise<Product>{
        const Productquery = `SELECT id,name,size,price,type,description,availability,image
                              FROM "Product"
                              WHERE id = $1 LIMIT 1;`;
        const product = (await this.ProductRepository.query(Productquery,[id]))[0];
        const AddonsQuery = `
            WITH ProductRLAddon AS (
            SELECT "addonId" 
            FROM "ProductRLAddon"
            WHERE "productId" = $1
            )
            SELECT pa.id, pa.name, pa.price
            FROM ProductRLAddon prla
            INNER JOIN "ProductAddon" pa ON pa.id = prla."addonId";`;
        product.Addons = (await this.ProductRepository.query(AddonsQuery,[product.id]));
        return product;
    }

    async GetProductById(user_id : string,id : string,IsUserProfessional: boolean):Promise<Product>{
        var UserClause = this.GetUserClause(IsUserProfessional);
        const Productquery = `SELECT id,name,size,price,type,description,availability,image
                       FROM "Product"
                       WHERE ${UserClause} = $1 AND id = $2 LIMIT 1;`;
        const product = (await this.ProductRepository.query(Productquery,[user_id,id]))[0];
        const AddonsQuery = `
            WITH ProductRLAddon AS (
                SELECT "addonId" 
                FROM "ProductRLAddon"
                WHERE "productId" = $1
            )
            SELECT pa.id, pa.name, pa.price
            FROM ProductRLAddon prla
            INNER JOIN "ProductAddon" pa ON pa.id = prla."addonId";`;
        product.Addons = (await this.ProductRepository.query(AddonsQuery,[product.id]));
        return product;         
    }

    async UpdateProductById(product: ProductDto,user_id: string,id: string,IsUserProfessional: boolean):Promise<void>{
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
        if(clauses.length == 0)
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

    async EditAddonById(id: string,user_id: string,IsUserProfessional: boolean,addonDto : ProductAddonDto):Promise<void>{
        const UserClause = this.GetUserClauseForAddon(IsUserProfessional);
        const values:any[] = [id,user_id];
        const updateClauses = [];
        if(addonDto.name != null)
        {
            updateClauses.push(`name = $${values.length + 1}`);
            values.push(addonDto.name);
        }
        if(addonDto.price != null)
        {
            updateClauses.push(`price = $${values.length + 1}`);
            values.push(addonDto.price);
        }

        if(updateClauses.length == 0)
            throw new UnauthorizedException("Please make some changes before submitting!");
        
        const query = `UPDATE "ProductAddon"
                       SET ${updateClauses.join(`,`)}
                       WHERE id = $1 AND ${UserClause} = $2;`;

        return await this.ProductRepository.query(query,values);
    }
    
    async DeleteAddonById(id: string,user_id: string,IsUserProfessional: boolean):Promise<void>{
        const UserClause = this.GetUserClauseForAddon(IsUserProfessional);
        const query = `WITH Addon as(
            DELETE FROM "ProductAddon"
            WHERE id = $1 AND $${UserClause} = $2
            RETURNING id
            ),
            ProductRLAddon as(
                DELETE FROM "ProductRLAddon"
                WHERE "addonId" = $1 
                RETURNING "addonId"
            )SELECT * FROM ProductRLAddon;
            `
        return await this.ProductRepository.query(query,[id,user_id]);
    }

    async DeleteProductById(id: string,user_id: string,IsUserProfessional:boolean):Promise<void>{
        const userClause = this.GetUserClause(IsUserProfessional);

        const query = `WITH Product as(
            DELETE  FROM "Product"
            WHERE id = $1 AND ${userClause} = $2
            RETURNING id
        ),
        ProductRLAddon as(
            DELETE FROM "ProductRLAddon"
            WHERE "productId" = $1
            RETURNING "addonId"
        )SELECT * FROM ProductRLAddon;`

        return await this.ProductRepository.query(query,[id,user_id]);
    }

    async EditProductImageById(id: string, user_id: string,file: string,IsUserProfessional: boolean):Promise<{previous_image: string}>{
        const userClause = this.GetUserClause(IsUserProfessional);

        const query = `With PreviousImage AS(
                        SELECT image as previous_image FROM "Product"
                        WHERE id = $1
                    ),
                    UpdateImage AS(
                        UPDATE "Product"
                        SET image = $2
                        WHERE id = $1 AND ${userClause} = $3
                    )SELECT * FROM PreviousImage;`;
        const values = [id,
                        file,
                        user_id
                        ];
        return (await this.ProductRepository.query(query,values))[0];
    }

    GetUserClause(IsUserProfessional: boolean):string{
        if(IsUserProfessional)
            return `"userId"`;
        else
            return `"franchiseUserId"`;
    }

    GetUserClauseForAddon(IsUserProfessional: boolean):string{
        if(IsUserProfessional)
            return `"professionalUserId"`;
        else
            return `"franchiseUserId"`;
    }
}