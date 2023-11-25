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
import { FranchiseUserPasswordEdit } from 'src/Entities/franchise_user/franchise_user_password_edit.entity';
import passport from 'passport';

@Injectable()
export class FranchiseUserService {
    constructor(
        @InjectRepository(FranchiseUser)
        private userRepository: Repository<FranchiseUser>,
        private jwtService: JwtService){}
    
    async Create(userDto: FranchiseUserDto,file: Buffer):Promise<void>{
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
            image:file,
        });
        await this.userRepository.save(new_user);
    }

    async SignIn(userDto: AuthSignIn):Promise<string>{
        const {username,password} = userDto;
    
        const user = await this.userRepository.findOne({where : [{username: username}]});
        if(!user)
          throw new UnauthorizedException("User is not registerd!");
        const password_compare = await bcrypt.compare(password,user.password);
        if(!password_compare)
          throw new UnauthorizedException("Incorrect Password!");
    
        const {id,description,email,phonenumber} = user;
        const payload: FranchiseJwtPayload = {id,username,description,email,phonenumber};
        return await this.jwtService.signAsync(payload);
    
    }

    async Edit(id:string,userDto: FranchiseUserEdit):Promise<string>{
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
      await this.userRepository.save(user);
      
      const {username,description,email,phonenumber} = user;
      const payload: FranchiseJwtPayload = {id,username,description,email,phonenumber};
      return await this.jwtService.signAsync(payload);
    }

    async EditPassword(id: string, userDto: FranchiseUserPasswordEdit):Promise<void>{
      const user = await this.userRepository.findOne({where:[{id:id}]});

      if(user == null)
        throw new UnauthorizedException("User doesn't exist!");

      if(!await bcrypt.compare(user.password,userDto.password))
        throw new UnauthorizedException("Invalid Password!");

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(userDto.password,salt);
      user.password = hashedPassword;
      
      await this.userRepository.save(user);
    }

    async EditPicture(id: string, File:Buffer):Promise<void>{
      const user = await this.userRepository.findOneBy({id});
      if(!user)
        throw new UnauthorizedException("User is not registered!");

      if(File == null)
        throw new Error("No file was imported!");

      user.image = File;

      await this.userRepository.save(user);
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
