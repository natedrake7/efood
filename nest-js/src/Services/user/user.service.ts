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
import { IsEmpty } from 'class-validator';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepostory: Repository<User>,
    private jwtService: JwtService,
    private readonly Queries: UserQueries){}

  async Create(userDto: UserDto):Promise<void>{
    const {username,firstname,lastname,password,email,phonenumber} = userDto;
    
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password,salt);
    const new_user = this.userRepostory.create({
      username,
      firstname,
      lastname,
      password: hashedPassword,
      email,
      phonenumber
    });
    await this.userRepostory.save(new_user);
  }

  async SignIn(userDto: AuthSignIn):Promise<string>{
    const {username,password} = userDto;

    const user = await this.userRepostory.findOne({where : [{username: username}]});
    if(!user)
      throw new UnauthorizedException("User is not registerd!");
    const password_compare = await bcrypt.compare(password,user.password);
    if(!password_compare)
      throw new UnauthorizedException("Incorrect Password!");

    const {id,firstname,lastname,email,phonenumber} = user;
    const payload: JwtPayload = {id,username,firstname,lastname,email,phonenumber};
    return await this.jwtService.signAsync(payload);

  }

  async Edit(id:string,userDto: UserEdit):Promise<string>{
    const user = await this.userRepostory.findOne({where : [{id: id}]});

    if(!user)
      throw new UnauthorizedException("User is not registerd!");

    const Edit_user = await this.userRepostory.query(this.Queries.UpdateUserByID(id,userDto));
    
    const {username,firstname,lastname,email,phonenumber} = Edit_user;
    const payload: JwtPayload = {id,username,firstname,lastname,email,phonenumber};

    return await this.jwtService.signAsync(payload);
  }

  async EditPassword(id: string, userDto: UserPasswordEdit):Promise<void>{
    const user = await this.userRepostory.findOne({where:[{id:id}]});

    if(!user)
      throw new UnauthorizedException("User doesn't exist!");

    if(!await bcrypt.compare(userDto.password,user.password))
      throw new UnauthorizedException("Invalid Password");

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(userDto.new_password,salt);

    await this.userRepostory.query(this.Queries.UpdateUserPasswordById(id,hashedPassword));
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

  async DeleteUserByID(id: string):Promise<string>{
    const user = await this.userRepostory.findOne({ where: [
      {id: id}]});
    if(!user)
      return "User not found!";
    await this.userRepostory.delete(id);
    return "User deleted successfully";
  }
}
