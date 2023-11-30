
import { Module } from '@nestjs/common';
import { ProductService } from 'src/Services/product/product.service';
import { ProductsController } from 'src/Controllers/product/products.controller';
import { FranchiseJwtStrategy } from 'src/Strategies/franchise.strategy';
import { ProfesionalJwtStrategy } from 'src/Strategies/professional.strategy';
import { ProductQueries } from 'src/DbQueries/ProductQueries';
import { UserJwtStrategy } from 'src/Strategies/jwt.strategy';
import { ProfessionalUserQueries } from 'src/DbQueries/ProfessionalUserQueries';
import { FranchiseUserQueries } from 'src/DbQueries/FranchiseUserQueries';
import { UserQueries } from 'src/DbQueries/UserQueries';
import { ValidationExceptionFilter } from 'src/Services/validation/validation_filter';
import { APP_FILTER } from '@nestjs/core';
import { SharedModule } from './shared.module';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule,ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

@Module({
  imports: [SharedModule,
            MulterModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
              storage: diskStorage({
                  destination: configService.get('PRODUCT_IMAGES_PATH'),
                  filename: (req,file,cb) => {
                    const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
                    const extension: string = path.parse(file.originalname).ext;
              
                    return cb(null,`${filename}${extension}`)
                  }
                })
              }),
              inject: [ConfigService]
            })],
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