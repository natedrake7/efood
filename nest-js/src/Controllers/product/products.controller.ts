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

@Controller('products')
export class ProductsController {
    constructor(private readonly productService: ProductService){}

   @Post('professional/create')
   @UseGuards(ProfessionalGuard)
   async ProfessionalCreate(@Body() body: {productDto : ProductDto, addonsDto: ProductAddonDto[]},@GetUser() user : ProfessionalUser):Promise<void>
   {
        const { productDto, addonsDto } = body;
        return this.productService.ProfessionalCreate(productDto,addonsDto,user);
   }

   @Get('professional/get/:id')
   @UseGuards(ProfessionalGuard)
   async ProfessionalGetById(@Param('id') id : string,@GetUser() user: ProfessionalUser):Promise<void | {product: Product,addons: ProductAddon[]}>
   {
     return this.productService.ProfessionalGetProductById(user,id);
   }

   @Get('professional/get')
   @UseGuards(ProfessionalGuard)
   async ProfessionalGetAll(@GetUser() user: ProfessionalUser):Promise<void | Product[]>
   {
     return this.productService.ProfessionalGetAll(user);
   }

   @Post('professional/edit/:id')
   @UseGuards(ProfessionalGuard)
   async ProfessionalProductEdit(@Param('id') id: string,@Body() productDto: ProductDto,@GetUser() user : ProfessionalUser):Promise<void>
   {
        return this.productService.ProfessionalProductEdit(productDto,user,id);
   }

   @Post('professional/delete/:id')
   @UseGuards(ProfessionalGuard)
   async ProfessionalProductDelete(@Param('id') id: string,@GetUser() user : ProfessionalUser):Promise<void>
   {
        return this.productService.ProfessionalProductDelete(id,user);
   }

   @Get('professional/addon/get/:id')
   @UseGuards(ProfessionalGuard)
   async ProfessionalAddonGet(@Param('id') id: string):Promise<void | ProductAddon>
   {
        return this.productService.AddonGet(id);
   }

   @Post('professional/addon/delete/:id')
   @UseGuards(ProfessionalGuard)
   async ProfessionalAddonDelete(@Param('id') id: string):Promise<void | ProductAddon>
   {
        return this.productService.AddonDelete(id);
   }

   @Post('professional/addon/edit/:id')
   @UseGuards(ProfessionalGuard)
   async ProfessionalAddonEdit(@Param('id') id: string,@Body() addonDto: ProductAddonDto):Promise<void>
   {
        return this.productService.AddonEdit(id,addonDto);
   }


   @Post('franchise/create')
   @UseGuards(FranchiseGuard)
   async FranchiseCreate(@Body() body: {productDto : ProductDto, addonsDto: ProductAddonDto[]},@GetUser() user : FranchiseUser):Promise<void>
   {
        const { productDto, addonsDto } = body;
        return this.productService.FranchiseCreate(productDto,addonsDto,user);
   }

   @Get('franchise/get/:id')
   @UseGuards(FranchiseGuard)
   async FranchiseGetById(@Param('id') id : string,@GetUser() user: FranchiseUser):Promise<void | {product: Product,addons: ProductAddon[]}>
   {
     return this.productService.FranchiseGetProductById(user,id);
   }

   @Get('franchise/get')
   @UseGuards(FranchiseGuard)
   async FranchiseGetAll(@GetUser() user: FranchiseUser):Promise<void | Product[]>
   {
     return this.productService.FranchiseGetAll(user);
   }

   @Post('franchise/edit/:id')
   @UseGuards(FranchiseGuard)
   async FranchiseProductEdit(@Param('id') id: string,@Body() productDto: ProductDto,@GetUser() user : FranchiseUser):Promise<void>
   {
        return this.productService.FranchiseProductEdit(productDto,user,id);
   }

   @Post('franchise/delete/:id')
   @UseGuards(FranchiseGuard)
   async FranchiseProductDelete(@Param('id') id: string,@GetUser() user : FranchiseUser):Promise<void>
   {
        return this.productService.FranchiseProductDelete(id,user);
   }

   @Get('franchise/addon/get/:id')
   @UseGuards(FranchiseGuard)
   async FranchiseAddonGet(@Param('id') id: string):Promise<void | ProductAddon>
   {
        return this.productService.AddonGet(id);
   }

   @Post('franchise/addon/delete/:id')
   @UseGuards(FranchiseGuard)
   async FranchiseAddonDelete(@Param('id') id: string):Promise<void | ProductAddon>
   {
        return this.productService.AddonDelete(id);
   }

   @Post('franchise/addon/edit/:id')
   @UseGuards(FranchiseGuard)
   async FranchiseAddonEdit(@Param('id') id: string,@Body() addonDto: ProductAddonDto):Promise<void>
   {
        return this.productService.AddonEdit(id,addonDto);
   }
}