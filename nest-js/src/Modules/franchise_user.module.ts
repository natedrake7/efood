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

@Module({
  imports: [SharedModule],
  providers: [FranchiseUserService,
    ProfessionalUserService,
    FranchiseJwtStrategy,
    ProfesionalJwtStrategy,
    ProfessionalUserQueries,
    FranchiseUserQueries,
    {provide: APP_FILTER,
    useClass: ValidationExceptionFilter}
  ],
  controllers: [FranchiseUserController],
})
export class FranchiselUsersModule {}