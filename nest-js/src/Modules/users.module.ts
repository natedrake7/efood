import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from 'src/Controllers/user/user.controller';
import { UserQueries } from 'src/DbQueries/UserQueries';
import { FranchiseUser } from 'src/Entities/franchise_user/franchise_user.entity';
import { ProfessionalUser } from 'src/Entities/professional_user/professionaluser.entity';
import { User } from 'src/Entities/user/user.entity';
import { UserService } from 'src/Services/user/user.service';
import { UserJwtStrategy } from 'src/Strategies/jwt.strategy';
import { APP_FILTER } from '@nestjs/core';
import { ValidationExceptionFilter } from 'src/Services/validation/validation_filter';

@Module({
  imports: [
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.register({
      secret: 'topSecret52',
      signOptions:{
        expiresIn: 3600,
      },
    }),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([ProfessionalUser]),
    TypeOrmModule.forFeature([FranchiseUser]),
  ],
  providers: [UserService,UserJwtStrategy,UserQueries,              
              {provide: APP_FILTER,
              useClass: ValidationExceptionFilter}],
  controllers: [UserController],
})
export class UsersModule {}