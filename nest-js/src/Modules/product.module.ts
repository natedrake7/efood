
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
import { ProductQueries } from 'src/DbQueries/ProductQueries';
import { UserJwtStrategy } from 'src/Strategies/jwt.strategy';
import { ProfessionalUserQueries } from 'src/DbQueries/ProfessionalUserQueries';
import { FranchiseUserQueries } from 'src/DbQueries/FranchiseUserQueries';
import { UserQueries } from 'src/DbQueries/UserQueries';
import { ValidationExceptionFilter } from 'src/Services/validation/validation_filter';
import { APP_FILTER } from '@nestjs/core';

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
  providers: [ProductService,ProfesionalJwtStrategy,
              FranchiseJwtStrategy,UserJwtStrategy,
              ProductQueries,ProfessionalUserQueries,
              FranchiseUserQueries,UserQueries,
              {provide: APP_FILTER,
                useClass: ValidationExceptionFilter}
              ],
  controllers: [ProductsController],
})
export class ProductsModule {}