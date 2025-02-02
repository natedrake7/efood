import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './Modules/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfessionalUsersModule } from './Modules/professional_user.module';
import { FranchiselUsersModule } from './Modules/franchise_user.module';
import { ProductsModule } from './Modules/product.module';
import { AddressModule } from './Modules/address.module';
import { OrderModule } from './Modules/order.module';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config/dist';
import { configValidationSchema } from './config.schema';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  imports: [ConfigModule.forRoot({
    validationSchema: configValidationSchema,
    isGlobal: true,
    envFilePath: [`.env.stage.${process.env.STAGE}`],
  }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService : ConfigService) => ({
          type: 'postgres',
          autoLoadEntities: true,
          entities: [
              __dirname + '/../**/*.entity{.ts,.js}',
          ],
          synchronize: true,
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
      }),
  }),
  NestjsFormDataModule,
  UsersModule,
  ProfessionalUsersModule,
  FranchiselUsersModule,
  ProductsModule,
  AddressModule,
  OrderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
