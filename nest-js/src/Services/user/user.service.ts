import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserDto } from 'src/Entities/user/UserDto';
import * as bcrypt from 'bcrypt'
import { AuthSignIn } from 'src/Entities/authsignin.entity';
import { JwtService } from '@nestjs/jwt/dist';
import { JwtPayload, RefreshJwtPayload } from 'src/Entities/jwt-payload.interface';
import { UserEdit } from 'src/Entities/user/useredit.entity';
import { UserPasswordEdit } from 'src/Entities/user/user_password_edit.entity';
import { UserQueries } from 'src/DbQueries/UserQueries';
import { isEmail, isNotEmpty, isPhoneNumber, maxLength, minLength } from 'class-validator';
import { User } from 'src/Entities/user/user.entity';

@Injectable()
export class UserService {
  constructor(
    private jwtService: JwtService,
    private readonly Queries: UserQueries){}

  async Create(userDto: UserDto):Promise<{accesstoken: string,refreshtoken:string} | string[]>{
    const errors = await this.UserExists(userDto.username,userDto.email,userDto.phonenumber);

    if(errors.length != 0)
      return errors;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(userDto.password,salt);
    userDto.password = hashedPassword;
    const {id,username,firstname,lastname,email,phonenumber} = await this.Queries.CreateUser(userDto);

    const payload: JwtPayload = {id,username,firstname,lastname,email,phonenumber};
    const refresh_payload: RefreshJwtPayload = {id,email,username};

    const accesstoken = await this.jwtService.signAsync(payload);
    const refreshtoken = await this.jwtService.signAsync(refresh_payload,{expiresIn: '7d'});

    return {accesstoken,refreshtoken};
  }

  async SignIn(userDto: AuthSignIn):Promise<{accesstoken: string,refreshtoken:string}>{
    const {username,password} = userDto;

    const user = await this.Queries.GetUserByUsername(username);
    
    if(!user)
      throw new UnauthorizedException("User is not registerd!");
    
    if(!await bcrypt.compare(password,user.password))
      throw new UnauthorizedException("Incorrect User or Password!");

    const {id,firstname,lastname,email,phonenumber} = user;
    const payload: JwtPayload = {id,username,firstname,lastname,email,phonenumber};
    const refresh_payload: RefreshJwtPayload = {id,email,username};

    const accesstoken = await this.jwtService.signAsync(payload);
    const refreshtoken = await this.jwtService.signAsync(refresh_payload,{expiresIn: '7d'});
    
    return {accesstoken,refreshtoken};
  }

  async Edit(user: User,userDto: UserEdit):Promise<{accesstoken: string} | {property: string,message:string}[]>{

    if(!user)
      throw new UnauthorizedException("User is not registered!");

    const errors = this.ValidateEdit(userDto);
    if(errors.length != 0)
      return errors;

    const userExistsErrors = await this.UserExists(userDto.username,userDto.email,userDto.phonenumber);

    const Edit_user = await this.Queries.UpdateUserById(user.id,userDto);
    const {id,username,firstname,lastname,email,phonenumber} = Edit_user;
    const payload: JwtPayload = {id,username,firstname,lastname,email,phonenumber};

    const accesstoken = await this.jwtService.signAsync(payload);

    return {accesstoken};
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

  async RefreshToken(user: User):Promise<{accesstoken : string}>{

    const {id,username,firstname,lastname,email,phonenumber} = user;

    const payload: JwtPayload = {id,username,firstname,lastname,email,phonenumber};

    const accesstoken = await this.jwtService.signAsync(payload);

    return {accesstoken};
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

  ValidateEdit(userDto : UserEdit):{property: string,message:string}[]
  {
    const errors:{property: string,message:string}[] = [];

    if(userDto.username != null && (!isNotEmpty(userDto.username) || !minLength(userDto.username,4) || !maxLength(userDto.username,20)))
      errors.push({property: 'username',message: 'Username must be between 4-20 characters long!'});
    if(userDto.email != null && !isEmail(userDto.email))
      errors.push({property: 'email',message: 'Invalid Email Address!'});
    if(userDto.firstname != null && (!minLength(userDto.firstname,4) || !maxLength(userDto.firstname,20)))
      errors.push({property:'firstname',message:'Firstname must be between 4-20 characters long!'});
    if(userDto.lastname != null && (!minLength(userDto.lastname,4) || !maxLength(userDto.lastname,20)))
      errors.push({property:'lastname',message:'Lastname must be between 4-20 characters long!'});
    if(userDto.phonenumber != null && !isPhoneNumber(userDto.phonenumber,'GR'))
      errors.push({property: 'phonenumber',message: 'Invalid Phonenumber (specify region e.g +30 6944444444)!'});

    return errors;
  }
}
