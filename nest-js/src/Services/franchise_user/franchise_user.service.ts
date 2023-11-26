import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt'
import { AuthSignIn } from 'src/Entities/authsignin.entity';
import { JwtService } from '@nestjs/jwt/dist';
import { FranchiseJwtPayload} from 'src/Entities/jwt-payload.interface';
import { FranchiseUserDto } from 'src/Entities/franchise_user/franchise_userdto.entity';
import { FranchiseUserEdit } from 'src/Entities/franchise_user/franchise_userEdit.entity';
import { FranchiseUserPasswordEdit } from 'src/Entities/franchise_user/franchise_user_password_edit.entity';
import { FranchiseUserQueries } from 'src/DbQueries/FranchiseUserQueries';
import { isEmail, isPhoneNumber } from 'class-validator';

@Injectable()
export class FranchiseUserService {
    constructor(
        private jwtService: JwtService,
        private readonly Queries: FranchiseUserQueries){}
    
    async Create(userDto: FranchiseUserDto,file: Buffer):Promise<string | string[]>{
      const errors = await this.UserExists(userDto.username,userDto.email,userDto.phonenumber);

      if(errors.length != 0)
        return errors

      const salt = await bcrypt.genSalt();

      userDto.password = await bcrypt.hash(userDto.password,salt);
      const user = await this.Queries.Create(userDto,file);

      const {id,username,description,email,phonenumber} = user;
      const payload: FranchiseJwtPayload = {id,username,description,email,phonenumber};

      return await this.jwtService.signAsync(payload);
    }

    async SignIn(userDto: AuthSignIn):Promise<string>{
        const user = await this.Queries.FindUserByUsername(userDto.username);

        if(!user)
          throw new UnauthorizedException("User is not registerd!");

        if(!await bcrypt.compare(userDto.password,user.password))
          throw new UnauthorizedException("Incorrect Password!");
    
        const {id,username,description,email,phonenumber} = user;

        const payload: FranchiseJwtPayload = {id,username,description,email,phonenumber};

        return await this.jwtService.signAsync(payload);
    
    }

    async Edit(id:string,userDto: FranchiseUserEdit):Promise<string | string[]>{
      const errors = await this.UserExists(userDto.username,userDto.email,userDto.phonenumber);

      if(errors.length != 0)
        return errors;

      const user = await this.Queries.UpdateUserById(id,userDto);
      
      const {username,description,email,phonenumber} = user;
      const payload: FranchiseJwtPayload = {id,username,description,email,phonenumber};

      return await this.jwtService.signAsync(payload);
    }

    async EditPassword(id: string, userDto: FranchiseUserPasswordEdit):Promise<void>{
      const {password} = await this.Queries.GetPasswordById(id);

      if(!password)
        throw new UnauthorizedException("User doesn't exist!");

      if(!await bcrypt.compare(userDto.password,password))
        throw new UnauthorizedException("Invalid Password!");

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(userDto.new_password,salt);
      
      return await this.Queries.UpdatePasswordById(id,hashedPassword);
    }

    async EditPicture(id: string, File:Buffer):Promise<void>{
      const user = await this.Queries.FindUserById(id);
      if(!user)
        throw new UnauthorizedException("User is not registered!");

      if(!File)
        throw new Error("No file was imported!");

        return await this.Queries.EditImageById(id,File);
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
