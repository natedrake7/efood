import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from 'src/Controllers/orders/orders.controller';
import { AddressQueries } from 'src/DbQueries/AddressQueries';
import { OrderQueries } from 'src/DbQueries/OrderQueries';
import { ProductQueries } from 'src/DbQueries/ProductQueries';
import { ProfessionalUserQueries } from 'src/DbQueries/ProfessionalUserQueries';
import { UserQueries } from 'src/DbQueries/UserQueries';
import { Address } from 'src/Entities/addresses/address.entity';
import { FranchiseUser } from 'src/Entities/franchise_user/franchise_user.entity';
import { Order } from 'src/Entities/order/order.entity';
import { OrderItem } from 'src/Entities/order/order_item.entity';
import { OrderItemRLProductAddon } from 'src/Entities/order/order_item_rl_product_addon';
import { Product } from 'src/Entities/products/product.entity';
import { ProductAddon } from 'src/Entities/products/product_addon.entity';
import { ProductRLAddon } from 'src/Entities/products/product_rl_addon';
import { ProfessionalUser } from 'src/Entities/professional_user/professionaluser.entity';
import { User } from 'src/Entities/user/user.entity';
import { OrderService } from 'src/Services/order/order.service';
import { UserJwtStrategy } from 'src/Strategies/jwt.strategy';
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
    TypeOrmModule.forFeature([User,FranchiseUser,ProfessionalUser,ProductAddon
                            ,Order,Address,OrderItem,Product,OrderItemRLProductAddon,ProductRLAddon])],
  providers: [OrderService,UserJwtStrategy,ProfesionalJwtStrategy,UserQueries,ProfessionalUserQueries,OrderQueries,AddressQueries,ProductQueries],
  controllers: [OrdersController],
})
export class OrderModule {}