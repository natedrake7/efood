import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository} from 'typeorm';
import * as bcrypt from 'bcrypt'
import { AuthSignIn } from 'src/Entities/authsignin.entity';
import { JwtService } from '@nestjs/jwt/dist';
import { ProfessionalJwtPayload } from 'src/Entities/jwt-payload.interface';
import { ProfessionalUser } from 'src/Entities/professional_user/professionaluser.entity';
import { ProfessionalUserDto } from 'src/Entities/professional_user/professional_userDto.entity';
import { ProfessionalUserEdit } from 'src/Entities/professional_user/professional_userEdit.entity';
import { error } from 'console';
import { ProfessionalUserReturnType } from 'src/Entities/professional_user/professional_user_return_type.entity';
import { Product } from 'src/Entities/products/product.entity';
import { ProfessionalUserPasswordEditDto } from 'src/Entities/professional_user/professional_user_password_edit.entity';
import { ProfessionalUserQueries } from 'src/DbQueries/ProfessionalUserQueries';

@Injectable()
export class ProfessionalUserService {
    constructor(@InjectRepository(ProfessionalUser)
        private userRepository: Repository<ProfessionalUser>,
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        private jwtService: JwtService,
        private readonly Queries: ProfessionalUserQueries){}
    
    async Create(userDto: ProfessionalUserDto,file: Buffer):Promise<string | string[]>{

        const errors = await this.UserExists(userDto.username,userDto.email,userDto.phonenumber);

        if(errors.length != 0)
          return errors;

        const salt = await bcrypt.genSalt();
        userDto.password = await bcrypt.hash(userDto.password,salt);
        const user = await this.Queries.CreateUser(userDto,file,null);

        const {id,username,address,delivery_time,description,email,phonenumber,city,zipcode} = user;
        const payload: ProfessionalJwtPayload = {id,username,address,delivery_time,city,zipcode,description,email,phonenumber};

        return await this.jwtService.signAsync(payload);
    }

    async FranchiseCreate(userDto: ProfessionalUserDto,franchiseuserId: string,file: Buffer):Promise<string | string[]>{

      const errors = await this.UserExists(userDto.username,userDto.email,userDto.phonenumber);

      if(errors.length != 0)
        return errors;

      const salt = await bcrypt.genSalt();
      userDto.password = await bcrypt.hash(userDto.password,salt);
      const user = await this.Queries.CreateUser(userDto,file,franchiseuserId);

      const {id,username,address,delivery_time,description,email,phonenumber,city,zipcode} = user;
      const payload: ProfessionalJwtPayload = {id,username,address,delivery_time,city,zipcode,description,email,phonenumber};

      return await this.jwtService.signAsync(payload);
  }

    async SignIn(userDto: AuthSignIn):Promise<string>{
        const {username,password} = userDto;
    
        const user = await this.Queries.GetUserByUsername(username);

        if(!user)
          throw new UnauthorizedException("User is not registerd!");

        if(!await bcrypt.compare(password,user.password))
          throw new UnauthorizedException("Incorrect Password!");
    
        const {id,address,delivery_time,description,email,phonenumber,city,zipcode} = user;
        const payload: ProfessionalJwtPayload = {id,username,address,delivery_time,city,zipcode,description,email,phonenumber};

        return await this.jwtService.signAsync(payload);
    }

    async FranchsiseSignIn(franchiseuser_id: string,authSignIn: AuthSignIn):Promise<string>{

      const user = await this.Queries.FranchiseGetUserByUsername(authSignIn.username,franchiseuser_id);
      if(!user)
        throw new UnauthorizedException("User is not registerd!");

      if(!await bcrypt.compare(authSignIn.password,user.password))
        throw new UnauthorizedException("Invalid Password!");

      const {id,username,address,delivery_time,description,email,phonenumber,city,zipcode} = user;
      const payload: ProfessionalJwtPayload = {id,username,address,delivery_time,city,zipcode,description,email,phonenumber};

      return await this.jwtService.signAsync(payload);
    }

    async Edit(id: string,userDto: ProfessionalUserEdit):Promise<string | string[]>{
      const errors = await this.UserExists(userDto.username,userDto.email,userDto.phonenumber);

      if(errors.length != 0)
        return errors;

      const user = await this.Queries.UpdateUserById(id,userDto);

      const {username,address,delivery_time,description,email,phonenumber,city,zipcode} = user;
      const payload: ProfessionalJwtPayload = {id,username,address,delivery_time,city,zipcode,description,email,phonenumber};
      
      return await this.jwtService.signAsync(payload);
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

    async EditImageById(id: string,File : Buffer):Promise<void>{

      if(!File)
        throw new UnauthorizedException("No file was imported!");

      const user = await this.Queries.GetUserById(id);

      if(!user)
        throw new UnauthorizedException("User doesn't exist!");

      return await this.Queries.EditImageById(id,File); 
    }

    async GetAll():Promise<ProfessionalUser[]>{
      return await this.Queries.GetAll();
    }

    async GetById(id : string):Promise<ProfessionalUser>{
     return await this.Queries.GetProductsById(id);
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
