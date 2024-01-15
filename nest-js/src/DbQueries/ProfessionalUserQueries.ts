import { ProfessionalUserDto } from "src/Entities/professional_user/professional_userDto.entity";
import { ProfessionalUserEdit } from "src/Entities/professional_user/professional_userEdit.entity";
import { UnauthorizedException } from "@nestjs/common/exceptions";
import { DataSource} from "typeorm"
import { ProfessionalUser } from "src/Entities/professional_user/professionaluser.entity";
import { InjectRepository } from "@nestjs/typeorm";


export class ProfessionalUserQueries{
    constructor(@InjectRepository(ProfessionalUser)
                private UserRepository:DataSource){}
    async CreateUser(userDto: ProfessionalUserDto,backgroundImage: string,profileImage: string,franchiseUserId : string):Promise<ProfessionalUser>{
        const query = `
            INSERT INTO "ProfessionalUser" (
                username, address,name, delivery_time, password, city, zipcode,type,
                timetable, email, phonenumber, description, "profileImage","backgroundImage",open_status,rating,"franchiseUserId"
            )
            VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
            ) RETURNING id,username,address,delivery_time,type,city,zipcode,timetable,email,"profileImage","backgroundImage",phonenumber,description;`;
        const values = [
            userDto.username,
            userDto.address,
            userDto.name,
            userDto.delivery_time,
            userDto.password,
            userDto.city,
            userDto.zipcode,
            userDto.type,
            userDto.timetable,
            userDto.email,
            userDto.phonenumber,
            userDto.description,
            profileImage,
            backgroundImage,
            false,
            0,
            franchiseUserId
        ];
        return (await this.UserRepository.query(query,values))[0];
    }
    async CheckUserExistanceById(id : string):Promise<boolean> {
        const query = `SELECT EXISTS (SELECT 1 FROM "ProfessionalUser" WHERE id = $1 LIMIT 1) AS match_found;`;
        return (await this.UserRepository.query(query,[id]))[0];  
    }    

    async GetUserById(id : string):Promise<ProfessionalUser> { 
        const query = `SELECT id,username,address,type,name,delivery_time,city,zipcode,timetable,email,phonenumber,description,"franchiseUserId","profileImage","backgroundImage" FROM "ProfessionalUser" WHERE id = $1 LIMIT 1;`
        return (await this.UserRepository.query(query,[id]))[0];
    }
    async GetUserByUsername(username: string):Promise<ProfessionalUser>{ 
        const query = `SELECT id,username,address,name,type,delivery_time,city,zipcode,password,timetable,email,phonenumber,description FROM "ProfessionalUser" WHERE username = $1 LIMIT 1;`;
        return (await this.UserRepository.query(query,[username]))[0];
    }
    async FranchiseGetUserByUsername(username: string,franchiseuser_id: string):Promise<ProfessionalUser>{
        const query = `SELECT id,username,name,address,type,delivery_time,city,zipcode,timetable,email,phonenumber,description FROM "ProfessionalUser" WHERE username = $1 AND "franchiseUserId" = $2 LIMIT 1;`
        return (await this.UserRepository.query(query,[username,franchiseuser_id]))[0];
    }

    async EditImageById(id : string, File : string,IsImageBackground:boolean):Promise<{previous_image: string}>{
         var imageClause: string = ` `;
         IsImageBackground ? imageClause = `"backgroundImage"` : imageClause = `"profileImage"`;


        const query =  `With PreviousImage AS(
                            SELECT ${imageClause} as previous_image FROM "ProfessionalUser"
                            WHERE id = $1
                        ),
                        UpdateImage AS(
                            UPDATE "ProfessionalUser"
                            SET ${imageClause} = $2
                            WHERE id = $1
                        )SELECT * FROM PreviousImage;`;
        return (await this.UserRepository.query(query,[id,File]))[0];
    }

    async GetAll():Promise<ProfessionalUser[]>{
        const query  = `SELECT id,name,address,type,delivery_time,city,zipcode,timetable,email,phonenumber,description,"profileImage","backgroundImage" FROM "ProfessionalUser";`;
        return (await this.UserRepository.query(query));
    }
    async GetUserWithProductsById(id : string):Promise<ProfessionalUser>{
        const user = await this.GetUserById(id);
        var clauses: string;
        var values: string;
        if(user.franchiseUserId){
            clauses = `"franchiseUserId" = $1`;
            values = user.franchiseUserId;
        }
        else
        {
            clauses = `"userId" = $1`;
            values = user.id;
        }
        user.username = null;
        const query = `SELECT name,size,price,image,type,description,availability,id FROM "Product"
                        WHERE ${clauses};`;
        const Products = (await this.UserRepository.query(query,[values]));
        user.franchiseUserId = null;
        
        user.products = Products;
        return user;
    }
    async UpdateUserById(id: string,userDto: ProfessionalUserEdit):Promise<ProfessionalUser> {    
        const updateClauses = [];
        const values = [];

        if (userDto.username != null)
        {
            updateClauses.push(`username = $${values.length + 1}`);
            values.push(userDto.username);
        }
        if(userDto.name != null)
        {
            updateClauses.push(`name = $${values.length + 1}`);
            values.push(userDto.name);
        }
        if(userDto.type != null)
        {
            updateClauses.push(`"type" = $${values.length + 1}`);
            values.push(userDto.type);
        }
        if (userDto.address != null)
        {
            updateClauses.push(`address = $${values.length + 1}`);
            values.push(userDto.address);
        }
        if (userDto.delivery_time != null)
        {
            updateClauses.push(`delivery_time = $${values.length + 1}`);
            values.push(userDto.delivery_time);
        }
        if (userDto.city != null) 
        {
            updateClauses.push(`city = $${values.length + 1}`);
            values.push(userDto.city);
        }
        if (userDto.zipcode !=null)
        {
            updateClauses.push(`zipcode = $${values.length + 1}`);
            values.push(userDto.zipcode);
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
        if (userDto.timetable !=null)
        {
            updateClauses.push(`timetable = $${values.length + 1}`);
            values.push(userDto.timetable);
        }

        if(updateClauses.length == 0)
            throw new UnauthorizedException("Please make some changes before submitting!");

        const query =  `
            UPDATE "ProfessionalUser"
            SET 
                ${updateClauses.join(', ')}
            WHERE id = '${id}' 
            RETURNING id,username,type,name,address,delivery_time,city,zipcode,email,phonenumber,description,timetable,rating,"profileImage","backgroundImage";`;

        return (await this.UserRepository.query(query,values))[0][0];
    }
    async GetPasswordById(id: string):Promise<{password: string}>{
        const query = `SELECT password FROM "ProfessionalUser" WHERE id = $1 LIMIT 1;`;
        return (await this.UserRepository.query(query,[id]))[0];
    }

    async UpdateUserPasswordById(id : string,password: string):Promise<void>{

        const query =  `Update "ProfessionalUser"
                SET password = $1
                WHERE id = $2 LIMIT 1;`;
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