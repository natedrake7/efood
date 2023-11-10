import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressesController } from 'src/Controllers/address/addresses.controller';
import { Address } from 'src/Entities/addresses/address.entity';
import { User } from 'src/Entities/user/user.entity';
import { AddressService } from 'src/Services/address/address.service';
import { UserJwtStrategy } from 'src/Strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.register({
      secret: 'topSecret52',
      signOptions:{
        expiresIn: 3600,
      },
    }),
    TypeOrmModule.forFeature([User,Address])],
  providers: [AddressService,UserJwtStrategy],
  controllers: [AddressesController],
})
export class AddressModule {}