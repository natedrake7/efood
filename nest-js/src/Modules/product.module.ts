
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FranchiseUser } from 'src/Entities/franchise_user/franchise_user.entity';
import { ProfessionalUser } from 'src/Entities/professional_user/professionaluser.entity';
import { Product } from 'src/Entities/products/product.entity';
import { ProductService } from 'src/Services/product/product.service';
import { ProductsController } from 'src/Controllers/product/products.controller';
import { ProductAddon } from 'src/Entities/products/product_addon.entity';

@Module({
  imports: [
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.register({
      secret: 'topSecret51',
      signOptions:{
        expiresIn: 3600,
      },
    }),
    TypeOrmModule.forFeature([Product]),
    TypeOrmModule.forFeature([ProductAddon])],
  providers: [ProductService],
  controllers: [ProductsController],
})
export class ProductsModule {}