import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from 'src/Controllers/orders/orders.controller';
import { Address } from 'src/Entities/addresses/address.entity';
import { FranchiseUser } from 'src/Entities/franchise_user/franchise_user.entity';
import { Order } from 'src/Entities/order/order.entity';
import { OrderProductAddon } from 'src/Entities/order/order_product_addon.entity';
import { Product } from 'src/Entities/products/product.entity';
import { ProductAddon } from 'src/Entities/products/product_addon.entity';
import { ProfessionalUser } from 'src/Entities/professional_user/professionaluser.entity';
import { User } from 'src/Entities/user/user.entity';
import { OrderService } from 'src/Services/order/order.service';
import { UserJwtStrategy } from 'src/Strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.register({
      secret: 'topSecret52',
      signOptions:{
        expiresIn: 3600,
      },
    }),
    TypeOrmModule.forFeature([User,FranchiseUser,ProfessionalUser,ProductAddon
                            ,Order,Address,OrderProductAddon,Product])],
  providers: [OrderService,UserJwtStrategy],
  controllers: [OrdersController],
})
export class OrderModule {}