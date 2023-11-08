import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository} from 'typeorm';
import * as bcrypt from 'bcrypt'
import { AuthSignIn } from 'src/Entities/authsignin.entity';
import { JwtService } from '@nestjs/jwt/dist';
import { FranchiseJwtPayload} from 'src/Entities/jwt-payload.interface';
import { FranchiseUser } from 'src/Entities/franchise_user/franchise_user.entity';
import { FranchiseUserDto } from 'src/Entities/franchise_user/franchise_userdto.entity';
import { FranchiseUserEdit } from 'src/Entities/franchise_user/franchise_userEdit.entity';

@Injectable()
export class FranchiseUserService {
    constructor(
        @InjectRepository(FranchiseUser)
        private userRepository: Repository<FranchiseUser>,
        private jwtService: JwtService){}
    
    async Create(userDto: FranchiseUserDto):Promise<void>{
        const {username,password,description,email,phonenumber} = userDto;

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password,salt);

        const new_user = this.userRepository.create({
            username,
            email,
            password: hashedPassword,
            phonenumber,
            description,
            rating: 0,
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
    
        const {id,description,email,phonenumber} = user;
        const payload: FranchiseJwtPayload = {id,username,type:'franchise',franchise_payload:true,description,email,phonenumber};
        const accessToken: string = await this.jwtService.sign(payload);
    
        return {accessToken};
    }

    async Edit(id:number,userDto: FranchiseUserEdit):Promise<{accessToken:string}>{
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
      if(userDto.description != user.description && userDto.description != null)
        user.description = userDto.description;
      if(userDto.phonenumber != user.phonenumber && userDto.phonenumber != null)
        user.phonenumber = userDto.phonenumber;
      if(userDto.email != user.email && userDto.email != null)
        user.email = userDto.email;
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
      
      const {username,description,email,phonenumber} = user;
      const payload: FranchiseJwtPayload = {id,username,type:'franchise',franchise_payload:true,description,email,phonenumber};
      const accessToken: string = await this.jwtService.sign(payload);
  
      return {accessToken};
      }

    async UserExists(userDto : FranchiseUserDto): Promise<string[]>{
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
