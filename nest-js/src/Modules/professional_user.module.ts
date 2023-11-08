
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfessionalUserController } from 'src/Controllers/professionaluser/professionaluser.controller';
import { ProfessionalUser } from 'src/Entities/professional_user/professionaluser.entity';
import { ProfessionalUserService } from 'src/Services/professional-user/professional-user.service';import { UsersModule } from './users.module';
import { JwtStrategy } from 'src/jwt.strategy';
import { User } from 'src/Entities/user/user.entity';
import { FranchiseUser } from 'src/Entities/franchise_user/franchise_user.entity';
;

@Module({
  imports: [
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.register({
      secret: 'topSecret51',
      signOptions:{
        expiresIn: 3600,
      },
    }),
    TypeOrmModule.forFeature([ProfessionalUser]),
  ],
  providers: [ProfessionalUserService],
  controllers: [ProfessionalUserController],
})
export class ProfessionalUsersModule {}