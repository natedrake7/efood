import { Injectable,Body, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/Entities/user.entity';
import { UserDto } from 'src/Entities/userDto';
import { Repository} from 'typeorm';
import * as bcrypt from 'bcrypt'
import { AuthSignIn } from 'src/Entities/authsignin.entity';
import { JwtService } from '@nestjs/jwt/dist';
import { JwtPayload } from 'src/Entities/jwt-payload.interface';
import { UserEdit } from 'src/Entities/useredit.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepostory: Repository<User>,
    private jwtService: JwtService){}

  async Create(userDto: UserDto):Promise<User>{
    const {username,firstname,lastname,password,email,phonenumber,role} = userDto;
    
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password,salt);

    const new_user = this.userRepostory.create({
      username,
      firstname,
      lastname,
      password: hashedPassword,
      email,
      phonenumber,
      role
    });
    await this.userRepostory.save(new_user);
    return new_user;
  }

  async SignIn(userDto: AuthSignIn):Promise<{accessToken: string}>{
    const {username,password} = userDto;

    const user = await this.userRepostory.findOne({where : [{username: username}]});
    if(!user)
      throw new UnauthorizedException("User is not registerd!");
    const password_compare = await bcrypt.compare(password,user.password);
    if(!password_compare)
      throw new UnauthorizedException("Incorrect Password!");

    const {id,firstname,lastname,email,phonenumber} = user;
    const payload: JwtPayload = {id,username,firstname,lastname,email,phonenumber};
    const accessToken: string = await this.jwtService.sign(payload);

    return {accessToken};
  }

  async Edit(userDto: UserEdit):Promise<{accessToken:string}>{
    const {id} = userDto;
    const user = await this.userRepostory.findOne({where : [{id: id}]});

    if(!user)
      throw new UnauthorizedException("User is not registerd!");

    if(userDto.username != user.username && userDto.username != null)
    {
      const {username} = userDto;
      const username_validation = await this.userRepostory.findOne({where : [{username}]});
      if(username_validation)
        throw new UnauthorizedException("Username is taken!");
      user.username = userDto.username;
    }
    if(userDto.firstname != user.firstname && userDto.firstname != null)
      user.firstname = userDto.firstname;
    if(userDto.lastname != user.lastname && userDto.lastname != null)
      user.lastname = userDto.lastname;
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
    await this.userRepostory.save(user);
    
    const {username,firstname,lastname,email,phonenumber} = user;
    const payload: JwtPayload = {id,username,firstname,lastname,email,phonenumber};
    const accessToken: string = await this.jwtService.sign(payload);

    return {accessToken};
    }

  async UserExists(userDto : UserDto): Promise<string[]>{
    const user = await this.userRepostory.findOne({ where: [
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

  async DeleteUserByID(id: number):Promise<string>{
    const user = await this.userRepostory.findOne({ where: [
      {id: id}]});
    if(!user)
      return "User not found!";
    await this.userRepostory.delete(id);
    return "User deleted successfully";
  }
}
