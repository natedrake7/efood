import { Controller,Get,Post,Body,UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FranchiseUser } from "src/Entities/franchise_user/franchise_user.entity";
import { ProductAddonDto } from "src/Entities/products/addonDto.entity";
import { ProductDto } from "src/Entities/products/productDto.entity";
import { ProfessionalUser } from "src/Entities/professional_user/professionaluser.entity";
import { ProductService } from "src/Services/product/product.service";
import { GetUser } from "src/get-user.decorator";

@Controller('products')
export class ProductsController {
    constructor(private readonly productService: ProductService){}

   @Post('professional/create')
   @UseGuards(AuthGuard())
   async ProfessionalCreate(@Body() body: {productDto : ProductDto, addonsDto: ProductAddonDto[]},@GetUser() user : ProfessionalUser):Promise<void>
   {
        const { productDto, addonsDto } = body;
        return this.productService.ProfessionalCreate(productDto,addonsDto,user);
   }

   @Post('franchise/create')
   @UseGuards(AuthGuard())
   async FranchiseCreate(@Body() body: {productDto : ProductDto, addonsDto: ProductAddonDto[]},@GetUser() user : FranchiseUser):Promise<void>
   {
        const { productDto, addonsDto } = body;
        return this.productService.FranchiseCreate(productDto,addonsDto,user);
   }

}