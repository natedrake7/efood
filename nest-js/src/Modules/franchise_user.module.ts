
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FranchiseUser } from 'src/Entities/franchise_user/franchise_user.entity';
import { FranchiseUserService } from 'src/Services/franchise_user/franchise_user.service';
import { FranchiseUserController } from 'src/Controllers/franchise-user/franchise-user.controller';
import { ProfessionalUserService } from 'src/Services/professional-user/professional-user.service';
import { ProfessionalUser } from 'src/Entities/professional_user/professionaluser.entity';
import { FranchiseJwtStrategy } from 'src/Strategies/franchise.strategy';
import { ProfesionalJwtStrategy } from 'src/Strategies/professional.strategy';
import { Product } from 'src/Entities/products/product.entity';
import { ProfessionalUserQueries } from 'src/DbQueries/ProfessionalUserQueries';
import { FranchiseUserQueries } from 'src/DbQueries/FranchiseUserQueries';

@Module({
  imports: [
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.register({
      secret: 'topSecret52',
      signOptions:{
        expiresIn: 3600,
      },
    }),
    TypeOrmModule.forFeature([FranchiseUser,ProfessionalUser,Product])],
  providers: [FranchiseUserService,ProfessionalUserService,FranchiseJwtStrategy,ProfesionalJwtStrategy,ProfessionalUserQueries,FranchiseUserQueries],
  controllers: [FranchiseUserController],
})
export class FranchiselUsersModule {}