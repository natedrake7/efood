import { Module } from '@nestjs/common';
import { AddressesController } from 'src/Controllers/address/addresses.controller';
import { AddressQueries } from 'src/DbQueries/AddressQueries';
import { UserQueries } from 'src/DbQueries/UserQueries';
import { AddressService } from 'src/Services/address/address.service';
import { UserJwtStrategy } from 'src/Strategies/jwt.strategy';
import { APP_FILTER } from '@nestjs/core';
import { ValidationExceptionFilter } from 'src/Services/validation/validation_filter';
import { SharedModule } from './shared.module';

@Module({
  imports: [SharedModule],
  providers: [AddressService,
              UserJwtStrategy,
              UserQueries,
              AddressQueries,
              {provide: APP_FILTER,
                useClass: ValidationExceptionFilter}],
  controllers: [AddressesController],
})
export class AddressModule {}