import { Controller,Get,Post,Body,UseGuards,Param } from "@nestjs/common";
import { FranchiseUser } from "src/Entities/franchise_user/franchise_user.entity";
import { ProductAddonDto } from "src/Entities/products/addonDto.entity";
import { ProductDto } from "src/Entities/products/productDto.entity";
import { ProfessionalUser } from "src/Entities/professional_user/professionaluser.entity";
import { ProductService } from "src/Services/product/product.service";
import { GetUser } from "src/get-user.decorator";
import { ProfessionalGuard } from "src/Guards/professional.guard";
import { FranchiseGuard } from "src/Guards/franchise.guard";
import { Product } from "src/Entities/products/product.entity";
import { ProductAddon } from "src/Entities/products/product_addon.entity";
import { UserGuard } from "src/Guards/user.guard";
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile } from '@nestjs/common';
import { UsePipes } from "@nestjs/common/decorators";
import { ValidationPipe } from "@nestjs/common/pipes";
import { UseInterceptors } from "@nestjs/common/decorators";

@Controller('products')
export class ProductsController {
    constructor(private readonly productService: ProductService){}

   @Post('professional/create')
   @UseGuards(ProfessionalGuard)
   @UsePipes(new ValidationPipe())
   @UseInterceptors(FileInterceptor('image'))
   async ProfessionalCreate(@Body() body: {productDto : string, addonsDto: string},@GetUser() user : ProfessionalUser,@UploadedFile() file):Promise<void>
   {
        const { productDto, addonsDto } = body;
        const addons = JSON.parse(addonsDto) as ProductAddonDto[];
        const product = JSON.parse(productDto) as ProductDto;
        return this.productService.Create(product,addons,user.id,file.path);
   }

   @Get('professional/get/:id')
   @UseGuards(ProfessionalGuard)
   async ProfessionalGetById(@Param('id') id : string,@GetUser() user: ProfessionalUser):Promise<void | Product>
   {
     return this.productService.GetProductById(user.id,id);
   }

   @Get('professional/get')
   @UseGuards(ProfessionalGuard)
   async ProfessionalGetAll(@GetUser() user: ProfessionalUser):Promise<void | Product[]>
   {
     return this.productService.GetAllProducts(user.id);
   }

   @Post('professional/edit/:id')
   @UseGuards(ProfessionalGuard)
   async ProfessionalProductEdit(@Param('id') id: string,@Body() productDto: ProductDto,@GetUser() user : ProfessionalUser):Promise<void>
   {
        return this.productService.EditProductById(productDto,user.id,id);
   }

   @Post('professional/edit/image/:id')
   @UseGuards(ProfessionalGuard)
   @UsePipes(new ValidationPipe())
   @UseInterceptors(FileInterceptor('image'))
   async ProfessionalEditProductImageById(@Param('id') id: string,@GetUser() user: ProfessionalUser,@UploadedFile() file):Promise<void>
   {
     return await this.productService.EditProductImageById(id,user.id,file.path);
   }

   @Post('professional/delete/:id')
   @UseGuards(ProfessionalGuard)
   async ProfessionalProductDelete(@Param('id') id: string,@GetUser() user : ProfessionalUser):Promise<void>
   {
        return this.productService.DeleteProductById(id,user.id);
   }

   @Get('professional/addon/get/:id')
   @UseGuards(ProfessionalGuard)
   async ProfessionalAddonGet(@Param('id') id: string,@GetUser() user:ProfessionalUser):Promise<void | ProductAddon>
   {
        return this.productService.GetAddonById(id,user.id);
   }

   @Post('professional/addon/delete/:id')
   @UseGuards(ProfessionalGuard)
   async ProfessionalAddonDelete(@Param('id') id: string,@GetUser() user: ProfessionalUser):Promise<void | ProductAddon>
   {
        return this.productService.DeleteAddonById(id,user.id);
   }

   @Post('professional/addon/edit/:id')
   @UseGuards(ProfessionalGuard)
   async ProfessionalAddonEdit(@Param('id') id: string,@Body() addonDto: ProductAddonDto,@GetUser() user: ProfessionalUser):Promise<void>
   {
        return this.productService.EditAddonById(id,user.id,addonDto);
   }


   @Post('franchise/create')
   @UseGuards(FranchiseGuard)
   @UsePipes(new ValidationPipe())
   @UseInterceptors(FileInterceptor('image'))
   async FranchiseCreate(@Body() body: {productDto : ProductDto, addonsDto: ProductAddonDto[]},@GetUser() user : FranchiseUser,@UploadedFile() file):Promise<void>
   {
        const { productDto, addonsDto } = body;
        return this.productService.Create(productDto, addonsDto,user.id,file.path,false);
   }

   @Get('franchise/get/:id')
   @UseGuards(FranchiseGuard)
   async FranchiseGetById(@Param('id') id : string,@GetUser() user: FranchiseUser):Promise<void | Product>
   {
     return this.productService.GetProductById(user.id,id,false);
   }

   @Get('franchise/get')
   @UseGuards(FranchiseGuard)
   async FranchiseGetAll(@GetUser() user: FranchiseUser):Promise<void | Product[]>
   {
     return this.productService.GetAllProducts(user.id,false);
   }

   @Post('franchise/edit/:id')
   @UseGuards(FranchiseGuard)
   async FranchiseProductEdit(@Param('id') id: string,@Body() productDto: ProductDto,@GetUser() user : FranchiseUser):Promise<void>
   {
        return this.productService.EditProductById(productDto,user.id,id,false);
   }

   @Post('franchise/edit/image/:id')
   @UseGuards(FranchiseGuard)
   @UsePipes(new ValidationPipe())
   @UseInterceptors(FileInterceptor('image'))
   async FranchiseEditProductImageById(@Param('id') id: string,@GetUser() user: FranchiseUser,@UploadedFile() file):Promise<void>
   {
     return this.productService.EditProductImageById(id,user.id,file.path,false);
   }

   @Post('franchise/delete/:id')
   @UseGuards(FranchiseGuard)
   async FranchiseProductDelete(@Param('id') id: string,@GetUser() user : FranchiseUser):Promise<void>
   {
        return this.productService.DeleteProductById(id,user.id,false);
   }

   @Get('franchise/addon/get/:id')
   @UseGuards(FranchiseGuard)
   async FranchiseAddonGet(@Param('id') id: string,@GetUser() user:FranchiseUser):Promise<void | ProductAddon>
   {
        return this.productService.GetAddonById(id,user.id,false);
   }

   @Post('franchise/addon/delete/:id')
   @UseGuards(FranchiseGuard)
   async FranchiseAddonDelete(@Param('id') id: string,@GetUser() user:FranchiseUser):Promise<void | ProductAddon>
   {
        return this.productService.DeleteAddonById(id,user.id,false);
   }

   @Post('franchise/addon/edit/:id')
   @UseGuards(FranchiseGuard)
   async FranchiseAddonEdit(@Param('id') id: string,@Body() addonDto: ProductAddonDto,@GetUser() user:FranchiseUser):Promise<void>
   {
        return this.productService.EditAddonById(id,user.id,addonDto,false);
   }

   @Get('commercial/:id')
   @UseGuards(UserGuard)
   async CommercialGetAllProductsByProfessionalId(@Param('id') id: string):Promise<void | Product[]>
   {
     return this.productService.GetCommericalProductsByUserId(id);
   }

   @Get('commercial/product/:id')
   @UseGuards(UserGuard)
   async CommercialGetProductById(@Param('id') id: string):Promise<void | Product>
   {
     return this.productService.GetCommercialProductById(id);
   }
}