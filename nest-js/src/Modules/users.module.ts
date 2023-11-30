import { Module } from '@nestjs/common';
import { UserController } from 'src/Controllers/user/user.controller';
import { UserQueries } from 'src/DbQueries/UserQueries';
import { UserService } from 'src/Services/user/user.service';
import { UserJwtStrategy } from 'src/Strategies/jwt.strategy';
import { APP_FILTER } from '@nestjs/core';
import { ValidationExceptionFilter } from 'src/Services/validation/validation_filter';
import { SharedModule } from './shared.module';
import { RefreshUserJwtStrategy } from 'src/Strategies/user_refresh.strategy';

@Module({
  imports: [SharedModule],
  providers: [UserService,
              UserJwtStrategy,
              RefreshUserJwtStrategy,
              UserQueries,              
              {provide: APP_FILTER,
              useClass: ValidationExceptionFilter}],
  controllers: [UserController],
})
export class UsersModule {}