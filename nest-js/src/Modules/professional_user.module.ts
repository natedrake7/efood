
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfessionalUserController } from 'src/Controllers/professionaluser/professionaluser.controller';
import { ProfessionalUserQueries } from 'src/DbQueries/ProfessionalUserQueries';
import { Product } from 'src/Entities/products/product.entity';
import { ProfessionalUser } from 'src/Entities/professional_user/professionaluser.entity';
import { ProfessionalUserService } from 'src/Services/professional-user/professional-user.service';
import { ProfesionalJwtStrategy } from 'src/Strategies/professional.strategy';

@Module({
  imports: [
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.register({
      secret: 'topSecret52',
      signOptions:{
        expiresIn: 3600,
      },
    }),
    TypeOrmModule.forFeature([ProfessionalUser,Product]),
  ],
  providers: [ProfessionalUserService,ProfesionalJwtStrategy,ProfessionalUserQueries],
  controllers: [ProfessionalUserController],
})
export class ProfessionalUsersModule {}