import { UserEdit } from "src/Entities/user/useredit.entity";
import { UnauthorizedException } from "@nestjs/common/exceptions";

export class UserQueries{
    GetUserByUsername(username: string):string{ return `SELECT username, firstname, lastname, email, phonenumber, id FROM "User" WHERE username = '${username}';`}
    UpdateUserByID(id: string,userDto: UserEdit):string {    
        const updateClauses = [];

        if (userDto.username != null) {
            updateClauses.push(`username = '${userDto.username}'`);
        }
    
        if (userDto.firstname != null) {
            updateClauses.push(`firstname = '${userDto.firstname}'`);
        }
    
        if (userDto.lastname != null) {
            updateClauses.push(`lastname = '${userDto.lastname}'`);
        }
    
        if (userDto.email != null) {
            updateClauses.push(`email = '${userDto.email}'`);
        }
    
        if (userDto.phonenumber !=null) {
            updateClauses.push(`phonenumber = '${userDto.phonenumber}'`);
        }
        if(updateClauses.length == 0)
            throw new UnauthorizedException("Please make some changes before submitting!");
    
        const updateQuery = `
            UPDATE "User"
            SET 
                ${updateClauses.join(', ')}
            WHERE id = '${id}'
            RETURNING id,username,lastname,email,phonenumber;`;
    
        return updateQuery;}
}