
import { Module } from '@nestjs/common';
import { ProfessionalUserController } from 'src/Controllers/professionaluser/professionaluser.controller';
import { ProfessionalUserQueries } from 'src/DbQueries/ProfessionalUserQueries';
import { ProfessionalUserService } from 'src/Services/professional-user/professional-user.service';
import { ProfesionalJwtStrategy } from 'src/Strategies/professional.strategy';
import { ValidationExceptionFilter } from 'src/Services/validation/validation_filter';
import { APP_FILTER } from '@nestjs/core';
import { SharedModule } from './shared.module';
import { RefreshProfessionalJwtStrategy } from 'src/Strategies/professional_refresh.strategy';
import { UserJwtStrategy } from 'src/Strategies/jwt.strategy';
import { UserQueries } from 'src/DbQueries/UserQueries';
import { ConfigModule,ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { MulterModule } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

@Module({
  imports: [SharedModule,
            MulterModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
              storage: diskStorage({
                  destination: configService.get('PROFILE_IMAGES_PATH'),
                  filename: (req,file,cb) => {
                    const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
                    const extension: string = path.parse(file.originalname).ext;
              
                    return cb(null,`${filename}${extension}`)
                  }
                })
              }),
              inject: [ConfigService]
            })],
  providers: [ProfessionalUserService,
              ProfesionalJwtStrategy,
              RefreshProfessionalJwtStrategy,
              UserJwtStrategy,
              UserQueries,
              ProfessionalUserQueries,
              {provide: APP_FILTER,
                useClass: ValidationExceptionFilter}],
  controllers: [ProfessionalUserController],
})
export class ProfessionalUsersModule {}