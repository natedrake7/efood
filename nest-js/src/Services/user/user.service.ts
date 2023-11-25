import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/Entities/user/user.entity';
import { UserDto } from 'src/Entities/user/UserDto';
import { Repository} from 'typeorm';
import * as bcrypt from 'bcrypt'
import { AuthSignIn } from 'src/Entities/authsignin.entity';
import { JwtService } from '@nestjs/jwt/dist';
import { JwtPayload } from 'src/Entities/jwt-payload.interface';
import { UserEdit } from 'src/Entities/user/useredit.entity';
import { UserPasswordEdit } from 'src/Entities/user/user_password_edit.entity';
import { UserQueries } from 'src/DbQueries/UserQueries';

@Injectable()
export class UserService {
  constructor(
    private jwtService: JwtService,
    private readonly Queries: UserQueries){}

  async Create(userDto: UserDto):Promise<string | string[]>{
    const errors = await this.UserExists(userDto.username,userDto.email,userDto.phonenumber);

    if(errors.length != 0)
      return errors;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(userDto.password,salt);
    userDto.password = hashedPassword;
    const {id,username,firstname,lastname,email,phonenumber} = await this.Queries.CreateUser(userDto);
    const payload: JwtPayload = {id,username,firstname,lastname,email,phonenumber};

    return await this.jwtService.signAsync(payload);
  }

  async SignIn(userDto: AuthSignIn):Promise<string>{
    const {username,password} = userDto;

    const user = await this.Queries.GetUserByUsername(username);
    
    if(!user)
      throw new UnauthorizedException("User is not registerd!");
    if(!await bcrypt.compare(password,user.password))
      throw new UnauthorizedException("Incorrect Password!");

    const {id,firstname,lastname,email,phonenumber} = user;
    const payload: JwtPayload = {id,username,firstname,lastname,email,phonenumber};
    return await this.jwtService.signAsync(payload);
  }

  async Edit(id:string,userDto: UserEdit):Promise<string>{
    const user = await this.Queries.GetUserById(id);

    if(!user)
      throw new UnauthorizedException("User is not registerd!");

    const Edit_user = await this.Queries.UpdateUserById(id,userDto);
    const {username,firstname,lastname,email,phonenumber} = Edit_user;
    const payload: JwtPayload = {id,username,firstname,lastname,email,phonenumber};

    return await this.jwtService.signAsync(payload);
  }

  async EditPassword(id: string, userDto: UserPasswordEdit):Promise<void>{
    const {password} = await this.Queries.GetPasswordById(id);

    if(!password)
      throw new UnauthorizedException("User doesn't exist!");

    if(!await bcrypt.compare(userDto.password,password))
      throw new UnauthorizedException("Invalid Password");

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(userDto.new_password,salt);

    return await this.Queries.UpdateUserPasswordById(id,hashedPassword);
  }

  async UserExists(username: string,email: string, phonenumber: string): Promise<string[]>{
    const users = await this.Queries.CheckIfUserExists(username,email,phonenumber);

    if(users.length == 0)
       return [];
    
    const errors : string[] = [];

    users.forEach(user=> {
      if(user.username == username && username != null)
        errors.push("Username is taken!");

      if(user.email == email && email != null)
        errors.push("Email is already used!");
   
      if(user.phonenumber == phonenumber && phonenumber != null)
        errors.push("Phonenumber already in use!");
    });

    return errors;
  }
}
