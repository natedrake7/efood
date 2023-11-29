import { Module } from '@nestjs/common';
import { OrdersController } from 'src/Controllers/orders/orders.controller';
import { AddressQueries } from 'src/DbQueries/AddressQueries';
import { OrderQueries } from 'src/DbQueries/OrderQueries';
import { ProductQueries } from 'src/DbQueries/ProductQueries';
import { ProfessionalUserQueries } from 'src/DbQueries/ProfessionalUserQueries';
import { UserQueries } from 'src/DbQueries/UserQueries';
import { OrderService } from 'src/Services/order/order.service';
import { UserJwtStrategy } from 'src/Strategies/jwt.strategy';
import { ProfesionalJwtStrategy } from 'src/Strategies/professional.strategy';
import { APP_FILTER } from '@nestjs/core';
import { ValidationExceptionFilter } from 'src/Services/validation/validation_filter';
import { SharedModule } from './shared.module';

@Module({
  imports: [SharedModule],
  providers: [OrderService,
              UserJwtStrategy,
              ProfesionalJwtStrategy,
              UserQueries,
              ProfessionalUserQueries,
              OrderQueries,
              AddressQueries,
              ProductQueries,              
              {provide: APP_FILTER,
              useClass: ValidationExceptionFilter}],
  controllers: [OrdersController],
})
export class OrderModule {}