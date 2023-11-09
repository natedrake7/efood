
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
import { User } from 'src/Entities/user/user.entity';
import { FranchiseJwtStrategy } from 'src/Strategies/franchise.strategy';
import { ProfesionalJwtStrategy } from 'src/Strategies/professional.strategy';

@Module({
  imports: [
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.register({
      secret: 'topSecret52',
      signOptions:{
        expiresIn: 3600,
      },
    }),
    TypeOrmModule.forFeature([Product]),
    TypeOrmModule.forFeature([ProductAddon]),
    TypeOrmModule.forFeature([FranchiseUser]),
    TypeOrmModule.forFeature([ProfessionalUser]),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [ProductService,ProfesionalJwtStrategy,FranchiseJwtStrategy],
  controllers: [ProductsController],
})
export class ProductsModule {}