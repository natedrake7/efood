import { Module } from "@nestjs/common/decorators/modules/module.decorator";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule,ConfigService } from '@nestjs/config';
import { TypeOrmModule } from "@nestjs/typeorm";
import { FranchiseUser } from "src/Entities/franchise_user/franchise_user.entity";
import { ProfessionalUser } from "src/Entities/professional_user/professionaluser.entity";
import { Product } from "src/Entities/products/product.entity";
import { User } from "src/Entities/user/user.entity";
import { Order } from "src/Entities/order/order.entity";
import { ProductAddon } from "src/Entities/products/product_addon.entity";
import { Address } from "src/Entities/addresses/address.entity";
import { OrderItem } from "src/Entities/order/order_item.entity";
import { OrderItemRLProductAddon } from "src/Entities/order/order_item_rl_product_addon";
import { ProductRLAddon } from "src/Entities/products/product_rl_addon";

@Module({
imports:[
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.registerAsync({
        imports:[ConfigModule],
        inject:[ConfigService],
        useFactory: async(configService: ConfigService)=> ({
            secret: configService.get('JWT_SECRET'),
            signOptions:{
                expiresIn: configService.get('JWT_EXPIRATION'),
            }
            }),
        }),TypeOrmModule.forFeature([FranchiseUser,
                              ProfessionalUser,
                              Product,User,Order,
                              ProductAddon,Address,
                              OrderItem,Product,
                              OrderItemRLProductAddon,
                              ProductRLAddon])],
    exports:[TypeOrmModule,PassportModule,JwtModule],
})export class SharedModule{}