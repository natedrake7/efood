import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt'
import { AuthSignIn, FranchiseProfessionalSignIn } from 'src/Entities/authsignin.entity';
import { JwtService } from '@nestjs/jwt/dist';
import { ProfessionalJwtPayload } from 'src/Entities/jwt-payload.interface';
import { ProfessionalUser } from 'src/Entities/professional_user/professionaluser.entity';
import { ProfessionalUserDto } from 'src/Entities/professional_user/professional_userDto.entity';
import { ProfessionalUserEdit } from 'src/Entities/professional_user/professional_userEdit.entity';
import { ProfessionalUserPasswordEditDto } from 'src/Entities/professional_user/professional_user_password_edit.entity';
import { ProfessionalUserQueries } from 'src/DbQueries/ProfessionalUserQueries';
import { isEmail, isPhoneNumber } from 'class-validator';
import { BadRequestException } from '@nestjs/common/exceptions';
import { RefreshJwtPayload } from 'src/Entities/jwt-payload.interface';
import * as fs from 'fs';

@Injectable()
export class ProfessionalUserService {
    constructor(
        private jwtService: JwtService,
        private readonly Queries: ProfessionalUserQueries){}
    
    async Create(userDto: ProfessionalUserDto,backgroundImage: string,profileImage: string):Promise<{accesstoken: string, refreshtoken:string} | string[]>{

        const errors = await this.UserExists(userDto.username,userDto.email,userDto.phonenumber);

        if(errors.length != 0)
        {
          if(fs.existsSync(backgroundImage))
          {
            try{
              fs.unlinkSync(backgroundImage);
            }
            catch(error){
              throw new Error(error);
            }
          }
          if(fs.existsSync(profileImage))
          {
            try{
              fs.unlinkSync(profileImage);
            }
            catch(error){
              throw new Error(error);
            }
          }
          return errors
        }

        const editedprofileImage = profileImage.replace(/\\/g, '/');
        const editedbackgroundImage = backgroundImage.replace(/\\/g, '/');

        const salt = await bcrypt.genSalt();
        userDto.password = await bcrypt.hash(userDto.password,salt);
        const user = await this.Queries.CreateUser(userDto,editedbackgroundImage,editedprofileImage,null);

        const {id,name,type,username,address,delivery_time,description,email,phonenumber,city,zipcode} = user;
        const payload: ProfessionalJwtPayload = {id,name,type,username,address,delivery_time,city,zipcode,description,email,phonenumber};

        const refresh_payload: RefreshJwtPayload = {id,email,username};

        const accesstoken = await this.jwtService.signAsync(payload);
        const refreshtoken = await this.jwtService.signAsync(refresh_payload);
    
        return {accesstoken,refreshtoken};
    }

    async FranchiseCreate(userDto: ProfessionalUserDto,franchiseuserId: string,backgroundImage: string,profileImage: string):Promise<{accesstoken: string, refreshtoken:string} | string[]>{

      const errors = await this.UserExists(userDto.username,userDto.email,userDto.phonenumber);

      if(errors.length != 0)
      {
        if(fs.existsSync(backgroundImage))
        {
          try{
            fs.unlinkSync(backgroundImage);
          }
          catch(error){
            throw new Error(error);
          }
        }
        if(fs.existsSync(profileImage))
        {
          try{
            fs.unlinkSync(profileImage);
          }
          catch(error){
            throw new Error(error);
          }
        }
        return errors
      }

      const editedprofileImage = profileImage.replace(/\\/g, '/');
      const editedbackgroundImage = backgroundImage.replace(/\\/g, '/');

      const salt = await bcrypt.genSalt();
      userDto.password = await bcrypt.hash(userDto.password,salt);
      const user = await this.Queries.CreateUser(userDto,editedbackgroundImage,editedprofileImage,franchiseuserId);

      const {id,name,username,type,address,delivery_time,description,email,phonenumber,city,zipcode} = user;
      const payload: ProfessionalJwtPayload = {id,name,type,username,address,delivery_time,city,zipcode,description,email,phonenumber};
      const refresh_payload: RefreshJwtPayload = {id,email,username};

      const accesstoken = await this.jwtService.signAsync(payload);
      const refreshtoken = await this.jwtService.signAsync(refresh_payload);
  
      return {accesstoken,refreshtoken};
  }

    async SignIn(userDto: AuthSignIn):Promise<{accesstoken: string, refreshtoken:string}>{
        const {username,password} = userDto;
    
        const user = await this.Queries.GetUserByUsername(username);

        if(!user)
          throw new UnauthorizedException("User is not registerd!");

        if(!await bcrypt.compare(password,user.password))
          throw new UnauthorizedException("Incorrect Password!");
    
        const {id,address,type,name,delivery_time,description,email,phonenumber,city,zipcode} = user;
        const payload: ProfessionalJwtPayload = {id,username,type,name,address,delivery_time,city,zipcode,description,email,phonenumber};
        const refresh_payload: RefreshJwtPayload = {id,email,username};

        const accesstoken = await this.jwtService.signAsync(payload);
        const refreshtoken = await this.jwtService.signAsync(refresh_payload,{expiresIn: '7d'});
    
        return {accesstoken,refreshtoken};
    }

    async FranchsiseSignIn(franchiseuser_id: string,authSignIn: FranchiseProfessionalSignIn):Promise<{accesstoken: string, refreshtoken:string}>{

      const user = await this.Queries.FranchiseGetUserByUsername(authSignIn.username,franchiseuser_id);
      if(!user)
        throw new UnauthorizedException("User is not registerd!");

      const {id,type,username,name,address,delivery_time,description,email,phonenumber,city,zipcode} = user;
      const payload: ProfessionalJwtPayload = {id,username,type,name,address,delivery_time,city,zipcode,description,email,phonenumber};
      const refresh_payload: RefreshJwtPayload = {id,email,username};

      const accesstoken = await this.jwtService.signAsync(payload);
      const refreshtoken = await this.jwtService.signAsync(refresh_payload,{expiresIn: '7d'});
    
      return {accesstoken,refreshtoken};
    }

    async Edit(id: string,userDto: ProfessionalUserEdit):Promise<{accesstoken: string} | string[]>{
      const errors = await this.UserExists(userDto.username,userDto.email,userDto.phonenumber);

      if(errors.length != 0)
        return errors;

      const user = await this.Queries.UpdateUserById(id,userDto);

      const {username,type,name,address,delivery_time,description,email,phonenumber,city,zipcode} = user;
      const payload: ProfessionalJwtPayload = {id,name,type,username,address,delivery_time,city,zipcode,description,email,phonenumber};
      
      const accesstoken = await this.jwtService.signAsync(payload);

      return {accesstoken};
    }

    async EditPassword(id: string,userDto: ProfessionalUserPasswordEditDto):Promise<void>{
      const {password}= await this.Queries.GetPasswordById(id);

      if(!password)
        throw new UnauthorizedException("User doesn't exist!");

      if(!await bcrypt.compare(userDto.password,password))
        throw new UnauthorizedException("Invalid Password!");

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(userDto.new_password,salt);
      return await this.Queries.UpdateUserPasswordById(id,hashedPassword);
    }

    async EditImageById(user: ProfessionalUser,File : string,IsImageBackground:boolean = false):Promise<void>{
      const editedFile = File.replace(/\\/g, '/');
      if(!File)
        throw new BadRequestException("No file was imported!");

      if(!user)
        throw new UnauthorizedException("User doesn't exist!");

      const {previous_image} = await this.Queries.EditImageById(user.id,editedFile,IsImageBackground);

      if(!fs.existsSync(previous_image))
        return;
      try{
        fs.unlinkSync(previous_image);
      }
      catch(error){
        throw new Error(error);
      }
    }

    async RefreshToken(user: ProfessionalUser):Promise<{accesstoken: string}>{
      const {id,type,name,username,address,delivery_time,description,email,phonenumber,city,zipcode} = user;
      const payload: ProfessionalJwtPayload = {id,name,type,username,address,delivery_time,city,zipcode,description,email,phonenumber};
      
      const accesstoken = await this.jwtService.signAsync(payload);

      return {accesstoken};
    }

    async GetAll():Promise<ProfessionalUser[]>{
      return await this.Queries.GetAll();
    }

    async GetById(id : string):Promise<ProfessionalUser>{
     return await this.Queries.GetUserWithProductsById(id);
    }

    async UserExists(username: string,email: string, phonenumber: string): Promise<string[]>{
      const errors : string[] = [];

      if(phonenumber != null && !isPhoneNumber(phonenumber))
        errors.push("Invalid Phonenumber (specify region e.g +30 6944444444)");

      if(email != null && !isEmail(email))
        errors.push("Invalid Email address!");

      if(errors.length > 0)
        return errors;

      const users = await this.Queries.CheckIfUserExists(username,email,phonenumber);
      var count = 0;
      users.forEach(user => {if(user.length == 0)count++;});

      if(count == users.length)
         return [];


      users.forEach(user => {
        if(user.length != 0 && user[0].username != undefined && user[0].username == username && username != null)
          errors.push("Username is taken!");
 
        if(user.length != 0  && user[0].email != undefined && user[0].email == email && email != null)
          errors.push("Email is already used!");
     
        if(user.length != 0  && user[0].phonenumber != undefined && user[0].phonenumber == phonenumber && phonenumber != null)
          errors.push("Phonenumber already in use!");
      });

      return errors;
    }
}
