import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository} from 'typeorm';
import * as bcrypt from 'bcrypt'
import { AuthSignIn } from 'src/Entities/authsignin.entity';
import { JwtService } from '@nestjs/jwt/dist';
import { ProfessionalJwtPayload } from 'src/Entities/jwt-payload.interface';
import { ProfessionalUser } from 'src/Entities/professional_user/professionaluser.entity';
import { ProfessionalUserDto } from 'src/Entities/professional_user/professional_userDto.entity';

@Injectable()
export class ProfessionalUserService {
    constructor(
        @InjectRepository(ProfessionalUser)
        private userRepository: Repository<ProfessionalUser>,
        private jwtService: JwtService){}
    
    async Create(userDto: ProfessionalUserDto):Promise<void>{
        const {username,address,password,description,email,phonenumber} = userDto;

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password,salt);

        const new_user = this.userRepository.create({
            username,
            address,
            email,
            password: hashedPassword,
            phonenumber,
            description,
            rating: 0,
            delivery_time: 0
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
    
        const {id,address,description,email,phonenumber} = user;
        const payload: ProfessionalJwtPayload = {id,username,address,description,email,phonenumber};
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
