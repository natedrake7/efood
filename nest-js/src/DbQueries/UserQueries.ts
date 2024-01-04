import { UserEdit } from "src/Entities/user/useredit.entity";
import { UnauthorizedException } from "@nestjs/common/exceptions";
import { UserDto } from "src/Entities/user/UserDto";
import { User } from "src/Entities/user/user.entity";
import { DataSource } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { isNotEmpty } from "class-validator";

export class UserQueries{
    constructor(@InjectRepository(User)
                private UserRepository: DataSource){}

    async CreateUser(userDto: UserDto):Promise<User>{
        const query =  `INSERT INTO "User" (username,firstname,lastname,email,password,phonenumber)
                VALUES ($1,$2,$3,$4,$5,$6)
                RETURNING id,username,firstname,lastname,email,password,phonenumber;`;
        return (await this.UserRepository.query(query,[userDto.username,userDto.firstname,userDto.lastname,userDto.email,
                                                       userDto.password,userDto.phonenumber]))[0];
    }
    async GetUserById(id : string):Promise<User> { 
        const query = `SELECT username, firstname, lastname, email, phonenumber, id FROM "User" WHERE id = $1 LIMIT 1;`;
        return (await this.UserRepository.query(query,[id]))[0];
    }
    async GetUserByUsername(username: string):Promise<User>{ 
        const query = `SELECT username, firstname, lastname, email, phonenumber,password,id FROM "User" WHERE username = $1 LIMIT 1;`
        return (await this.UserRepository.query(query,[username]))[0];
    }
    async UpdateUserById(id: string,userDto: UserEdit):Promise<User> {    
        const updateClauses = [];
        const values = [];
        if (userDto.username != null)
        {
            updateClauses.push(`username = $${values.length + 1}`);
            values.push(userDto.username);
        }
        if (userDto.firstname != null)
        {
            updateClauses.push(`firstname = $${values.length + 1}`);
            values.push(userDto.firstname);
        }
        if (userDto.lastname != null) 
        {
            updateClauses.push(`lastname = $${values.length + 1}`);
            values.push(userDto.lastname);
        }
        if (userDto.email != null) 
        {
            updateClauses.push(`email = $${values.length + 1}`);
            values.push(userDto.email);
        }
        if (userDto.phonenumber !=null)
        {
            updateClauses.push(`phonenumber = $${values.length + 1}`);
            values.push(userDto.phonenumber);
        }
        if(updateClauses.length == 0)
            throw new UnauthorizedException("Please make some changes before submitting!");
        
        const query =  `
            UPDATE "User"
            SET 
                ${updateClauses.join(', ')}
            WHERE id = '${id}' 
            RETURNING id,username,firstname,lastname,email,phonenumber;`;

        return (await this.UserRepository.query(query,values))[0][0];
    }
    async GetPasswordById(id: string):Promise<{password: string}>{
        const query = `SELECT password from "User" where id = $1 LIMIT 1;`;
        return (await this.UserRepository.query(query,[id]))[0];
    }
    async UpdateUserPasswordById(id : string,password: string):Promise<void>{
        const query = `Update "User"
                       SET password = $1
                       WHERE id = $2;`;
        return (await this.UserRepository.query(query,[password,id]))[0];
    }
    async CheckIfUserExists(username: string,email: string,phonenumber: string):Promise<any[]>{
        const return_values = [];
        const queryClauses  = [];
        const values = [];
        if(username != null){
            return_values.push("username");
            queryClauses.push(`username = $${values.length + 1}`);
            values.push(username);
        }
        if(email != null){
            return_values.push("email");
            queryClauses.push(`email = $${values.length + 1}`);
            values.push(email);
        }
        if(phonenumber != null){
            return_values.push("phonenumber");
            queryClauses.push(`phonenumber = $${values.length + 1}`);
            values.push(phonenumber);
        }
        
        if(values.length == 0)
            return [];

        const UserQuery = `SELECT ${return_values.join(',')} FROM "User" WHERE ${queryClauses.join(' OR ')};`;
        const ProfessionalUserQuery = `SELECT ${return_values.join(',')}  FROM "ProfessionalUser" WHERE ${queryClauses.join(' OR ')} ;`

        const FranchiseUserQuery = `SELECT ${return_values.join(',')} FROM "FranchiseUser" WHERE ${queryClauses.join(' OR ')};`;
        const Users = [];
        Users.push(await this.UserRepository.query(UserQuery,values));
        Users.push(await this.UserRepository.query(ProfessionalUserQuery,values));
        Users.push(await this.UserRepository.query(FranchiseUserQuery,values));
        return Users;
    }
    
}