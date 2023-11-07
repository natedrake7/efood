import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './Modules/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfessionalUsersModule } from './Modules/professional_user.module';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
    host: "localhost",
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'efood',
    autoLoadEntities: true,
    entities: [
        __dirname + '/../**/*.entity{.ts,.js}',
    ],
    synchronize: true
  }),
  UsersModule,
  ProfessionalUsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
