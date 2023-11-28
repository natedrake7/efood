import { UnauthorizedException } from "@nestjs/common/exceptions";
import { DataSource} from "typeorm";
import { FranchiseUser } from "src/Entities/franchise_user/franchise_user.entity";
import { FranchiseUserDto } from "src/Entities/franchise_user/franchise_userdto.entity";
import { FranchiseUserEdit } from "src/Entities/franchise_user/franchise_userEdit.entity";
import { InjectRepository } from "@nestjs/typeorm";

export class FranchiseUserQueries{
    constructor(@InjectRepository(FranchiseUser)
                private UserRepository: DataSource){}
    async Create(userDto : FranchiseUserDto,file : string):Promise<FranchiseUser>{
        const query = `INSERT INTO "FranchiseUser"(
                    username,password,description,email,phonenumber,rating,image
                    )
                    VALUES(
                        $1,$2,$3,$4,$5,$6,$7
                    )RETURNING id,username,description,email,phonenumber;`;
        const values = [userDto.username,
                        userDto.password,
                        userDto.description,
                        userDto.email,
                        userDto.phonenumber,
                        0,
                        file
                        ];
        return (await this.UserRepository.query(query,values))[0];
    }

    async FindUserByUsername(username: string):Promise<FranchiseUser>{
        const query = `SELECT id,username,password,description,email,phonenumber from "FranchiseUser" WHERE username = $1 LIMIT 1`;
        return (await this.UserRepository.query(query,[username]))[0];
    }

    async FindUserById(id: string):Promise<FranchiseUser>{
        const query = `SELECT id,username,password,description,email,phonenumber from "FranchiseUser" WHERE id = $1 LIMIT 1`;
        return (await this.UserRepository.query(query,[id]))[0];
    }

    async GetPasswordById(id : string):Promise<{password: string}>{
        const query = `SELECT password FROM "FranchiseUser" WHERE id = $1 LIMIT 1;`;
        return (await this.UserRepository.query(query,[id]))[0];
    }

    async UpdatePasswordById(id: string,password: string):Promise<void>{
        const query = `UPDATE "FranchiseUser"
                        SET password = $1
                        WHERE id = $2;`;
        return (await this.UserRepository.query(query,[password,id]))[0];
    }

    async EditImageById(id : string, File : string):Promise<{previous_image: string}>{
        const query =  `With PreviousImage AS(
                            SELECT image as previous_image FROM "FranchiseUser"
                            WHERE id = $1
                        ),
                        UpdateImage AS(
                            UPDATE "ProfessionalUser"
                            SET image = $2
                            WHERE id = $1
                        )SELECT * FROM PreviousImage;`;
        return (await this.UserRepository.query(query,[id,File]))[0];
    }

    async UpdateUserById(id: string,userDto: FranchiseUserEdit):Promise<FranchiseUser>{
        const updateClauses = [];
        const values = [];
        
        if (userDto.username != null)
        {
            updateClauses.push(`username = $${values.length + 1}`);
            values.push(userDto.username);
        }
        if (userDto.email !=null)
        {
            updateClauses.push(`email = $${values.length + 1}`);
            values.push(userDto.email);
        }
        if (userDto.phonenumber !=null)
        {
            updateClauses.push(`phonenumber = $${values.length + 1}`);
            values.push(userDto.phonenumber);
        }
        if (userDto.description !=null)
        {
            updateClauses.push(`description = $${values.length + 1}`);
            values.push(userDto.description);
        }

        if(updateClauses.length == 0)
            throw new UnauthorizedException("Please make some changes before submitting!");

        const query =  `
            UPDATE "FranchiseUser"
            SET 
                ${updateClauses.join(', ')}
            WHERE id = '${id}' 
            RETURNING id,username,email,phonenumber,description;`;

        return (await this.UserRepository.query(query,values))[0][0];
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