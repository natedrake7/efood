import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from 'src/Controllers/user/user.controller';
import { User } from 'src/Entities/user/user.entity';
import { UserService } from 'src/Services/user/user.service';
import { JwtStrategy } from 'src/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.register({
      secret: 'topSecret51',
      signOptions:{
        expiresIn: 3600,
      },
    }),
    TypeOrmModule.forFeature([User])],
  providers: [UserService,JwtStrategy],
  controllers: [UserController],
  exports: [JwtStrategy,PassportModule]
})
export class UsersModule {}