import { InjectRepository } from "@nestjs/typeorm";
import { compareSync } from "bcrypt";
import { join } from "path";
import { ProductAddonDto } from "src/Entities/products/addonDto.entity";
import { Product } from "src/Entities/products/product.entity";
import { ProductDto } from "src/Entities/products/productDto.entity";
import { DataSource } from "typeorm";
import { v4 as uuidv4 } from 'uuid';

export class ProductQueries{
    constructor(@InjectRepository(Product)
                private ProductRepository: DataSource){}
    async CreateProduct(productDto : ProductDto,id: string):Promise<{id: string}>{
        const query = `INSERT INTO "Product"(
                        name,size,price,type,description,availability,"userId"
                        )
                       VALUES(
                        $1,$2,$3,$4,$5,$6,$7
                       )RETURNING id;`;
        const values = [productDto.name,
                        productDto.size,
                        productDto.price,
                        productDto.type,
                        productDto.description,
                        productDto.availability,
                        id
                        ];
        return (await this.ProductRepository.query(query,values))[0];
    }

    async CreateAddons(id : string,ProductId: string,addonsDto: ProductAddonDto[]):Promise<any[]>{
        const clauses = [];
        const ProductRelationAddonClauses = [];
        const values = [];
        if(addonsDto.length == 0)
            return;
        addonsDto.forEach(addon =>{
            clauses.push(`($${values.length + 1},$${values.length + 2},$${values.length + 3},$${values.length + 4})`);
            addon.id = uuidv4();
            values.push(addon.id);
            values.push(addon.name);
            values.push(addon.price);
            values.push(id);
        });
        addonsDto.forEach(addon =>{
            ProductRelationAddonClauses.push(`($${values.length + 1},${values.length + 2})`);
            values.push(addon.id);
            values.push(ProductId);
        });
        const query = `INSERT INTO "ProductAddon"(
                        id,name,price,"professionalUserId"
                        )
                        VALUES ${clauses.join(`,`)};
                        INSERT INTO "product_addon_products_product"(
                            "productAddonId","productId"
                        )
                        VALUES ${ProductRelationAddonClauses.join(`,`)} RETURNING "productAddonId";`;
        const ids = await this.ProductRepository.query(query,values);
        return ids;
    }
}