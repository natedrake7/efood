
import { Module } from '@nestjs/common';
import { ProfessionalUserController } from 'src/Controllers/professionaluser/professionaluser.controller';
import { ProfessionalUserQueries } from 'src/DbQueries/ProfessionalUserQueries';
import { ProfessionalUserService } from 'src/Services/professional-user/professional-user.service';
import { ProfesionalJwtStrategy } from 'src/Strategies/professional.strategy';
import { ValidationExceptionFilter } from 'src/Services/validation/validation_filter';
import { APP_FILTER } from '@nestjs/core';
import { SharedModule } from './shared.module';


@Module({
  imports: [SharedModule],
  providers: [ProfessionalUserService,
              ProfesionalJwtStrategy,
              ProfessionalUserQueries,
              {provide: APP_FILTER,
                useClass: ValidationExceptionFilter}],
  controllers: [ProfessionalUserController],
})
export class ProfessionalUsersModule {}