import { Module } from '@nestjs/common';
import { FranchiseUserService } from 'src/Services/franchise_user/franchise_user.service';
import { FranchiseUserController } from 'src/Controllers/franchise-user/franchise-user.controller';
import { ProfessionalUserService } from 'src/Services/professional-user/professional-user.service';
import { FranchiseJwtStrategy } from 'src/Strategies/franchise.strategy';
import { ProfesionalJwtStrategy } from 'src/Strategies/professional.strategy';
import { ProfessionalUserQueries } from 'src/DbQueries/ProfessionalUserQueries';
import { FranchiseUserQueries } from 'src/DbQueries/FranchiseUserQueries';
import { ValidationExceptionFilter } from 'src/Services/validation/validation_filter';
import { APP_FILTER } from '@nestjs/core';
import { SharedModule } from './shared.module';
import { RefreshProfessionalJwtStrategy } from 'src/Strategies/professional_refresh.strategy';
import { RefreshFranchiseJwtStrategy } from 'src/Strategies/franchise_refresh.strategy';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule,ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Module({
  imports: [SharedModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        storage: diskStorage({
            destination: configService.get('PROFESSIONAL_IMAGES_PATH'),
            filename: (req,file,cb) => {
              const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
              const extension: string = path.parse(file.originalname).ext;
        
              return cb(null,`${filename}${extension}`)
            }
          })
        }),
        inject: [ConfigService]
      })],
  providers: [FranchiseUserService,
    ProfessionalUserService,
    FranchiseJwtStrategy,
    ProfesionalJwtStrategy,
    RefreshProfessionalJwtStrategy,
    RefreshFranchiseJwtStrategy,
    ProfessionalUserQueries,
    FranchiseUserQueries,
    {provide: APP_FILTER,
    useClass: ValidationExceptionFilter}
  ],
  controllers: [FranchiseUserController],
})
export class FranchiselUsersModule {}