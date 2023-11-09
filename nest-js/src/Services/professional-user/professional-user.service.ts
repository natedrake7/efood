import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository} from 'typeorm';
import * as bcrypt from 'bcrypt'
import { AuthSignIn } from 'src/Entities/authsignin.entity';
import { JwtService } from '@nestjs/jwt/dist';
import { ProfessionalJwtPayload } from 'src/Entities/jwt-payload.interface';
import { ProfessionalUser } from 'src/Entities/professional_user/professionaluser.entity';
import { ProfessionalUserDto } from 'src/Entities/professional_user/professional_userDto.entity';
import { FranchiseUser } from 'src/Entities/franchise_user/franchise_user.entity';
import { ProfessionalUserEdit } from 'src/Entities/professional_user/professional_userEdit.entity';

@Injectable()
export class ProfessionalUserService {
    constructor(
        @InjectRepository(ProfessionalUser)
        private userRepository: Repository<ProfessionalUser>,
        private jwtService: JwtService){}
    
    async Create(userDto: ProfessionalUserDto):Promise<void>{
        const {username,address,password,city,zipcode,description,timetable,email,phonenumber} = userDto;

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password,salt);

        const new_user = this.userRepository.create({
            username,
            address,
            email,
            password: hashedPassword,
            phonenumber,
            description,
            zipcode,
            city,
            timetable,
            open_status: false,
            rating: 0,
            delivery_time: 0
        });
        await this.userRepository.save(new_user);
    }

    async FranchiseCreate(userDto: ProfessionalUserDto,franchiseuser: FranchiseUser):Promise<void>{
      const {username,address,password,city,zipcode,description,timetable,email,phonenumber} = userDto;

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password,salt);

      const new_user = this.userRepository.create({
          username,
          address,
          email,
          password: hashedPassword,
          phonenumber,
          description,
          zipcode,
          city,
          timetable,
          open_status: false,
          rating: 0,
          delivery_time: 0,
          franchise_user:franchiseuser
      });
      await this.userRepository.save(new_user);
  }

    async SignIn(userDto: AuthSignIn):Promise<{accessToken: string}>{
        const {username,password} = userDto;
    
        const user = await this.userRepository.findOne({where : [{username: username}]});
        if(!user)
          throw new UnauthorizedException("User is not registerd!");
        const password_compare = await bcrypt.compare(password,user.password);
        if(!password_compare)
          throw new UnauthorizedException("Incorrect Password!");
    
        const {id,address,delivery_time,description,email,phonenumber,city,zipcode} = user;
        const payload: ProfessionalJwtPayload = {id,username,address,delivery_time,city,zipcode,description,email,phonenumber};
        const accessToken: string = await this.jwtService.sign(payload);
    
        return {accessToken};
    }

    async FranchsiseSignIn(userDto: FranchiseUser,username: string):Promise<{accessToken: string}>{
      const user = await this.userRepository.findOne({where : [{username},{franchise_user:userDto}]});
      if(!user)
        throw new UnauthorizedException("User is not registerd!");

      const {id,address,delivery_time,description,email,phonenumber,city,zipcode} = user;
      const payload: ProfessionalJwtPayload = {id,username,address,delivery_time,city,zipcode,description,email,phonenumber};
      const accessToken: string = await this.jwtService.sign(payload);
  
      return {accessToken};

    }

    async Edit(id: string,userDto: ProfessionalUserEdit):Promise<{accessToken: string}>{
      const user = await this.userRepository.findOne({where : [{id: id}]});
  
      if(!user)
        throw new UnauthorizedException("User is not registerd!");
  
      if(userDto.username != user.username && userDto.username != null)
      {
        const {username} = userDto;
        const username_validation = await this.userRepository.findOne({where : [{username}]});
        if(username_validation)
          throw new UnauthorizedException("Username is taken!");
        user.username = userDto.username;
      }
      if(userDto.address != user.address && userDto.address != null)
        user.address= userDto.address;
      if(userDto.description != user.description && userDto.description != null)
        user.description = userDto.description;
      if(userDto.delivery_time != user.delivery_time && userDto.delivery_time != null)
        user.delivery_time = userDto.delivery_time;
      if(userDto.phonenumber != user.phonenumber && userDto.phonenumber != null)
        user.phonenumber = userDto.phonenumber;
      if(userDto.email != user.email && userDto.email != null)
        user.email = userDto.email;
      if(userDto.city != user.city && userDto.city != null)
        user.city = userDto.city;
      if(userDto.zipcode != user.zipcode && userDto.zipcode != null)
        user.zipcode = userDto.zipcode;
      if(userDto.password != null)
      {
        const password_compare = await bcrypt.compare(userDto.password,user.password);
        if(password_compare)
        {
          const salt = await bcrypt.genSalt();
          const hashedPassword = await bcrypt.hash(userDto.password,salt);
          user.password = hashedPassword;
        }
      }
      await this.userRepository.save(user);
      
      const {username,address,description,city,zipcode,delivery_time,email,phonenumber} = user;
      const payload: ProfessionalJwtPayload = {id,username,address,description,city,zipcode,delivery_time,email,phonenumber};

      const accessToken: string = await this.jwtService.sign(payload);
  
      return {accessToken};
    }

    async UserExists(userDto : ProfessionalUserDto): Promise<string[]>{
        const user = await this.userRepository.findOne({ where: [
          {username: userDto.username},
          {email : userDto.email},
          {phonenumber : userDto.phonenumber}]
           });
        if(!user)
           return [];
        
        const errors : string[] = [];
    
        if(user.username == userDto.username)
           errors.push("Username is taken!");
    
        if(user.email == userDto.email)
           errors.push("Email is already used!");
        
        if(user.phonenumber == userDto.phonenumber)
           errors.push("Phonenumber already in use!");
        return errors;
      }
}
