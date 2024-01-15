import { InjectRepository } from "@nestjs/typeorm";
import { Address } from "src/Entities/addresses/address.entity";
import { AddressDto } from "src/Entities/addresses/addressDto.entity";
import { AddressEdit } from "src/Entities/addresses/address_edit.entity";
import { Repository } from "typeorm";
import { UnauthorizedException } from "@nestjs/common/exceptions";

export class AddressQueries{
    constructor(@InjectRepository(Address)
                private AddressRepository: Repository<Address>){}
    async CreateAddress(user_id: string,addressDto: AddressDto):Promise<void>{
        const query = `INSERT INTO "Address"(
                        address,number,zipcode,city,phonenumber,ringbell,floor,"userId"
                        )
                    VALUES(
                        $1,$2,$3,$4,$5,$6,$7,$8
                        )`
        const values = [addressDto.address,
                        addressDto.number,
                        addressDto.zipcode,
                        addressDto.city,
                        addressDto.phonenumber,
                        addressDto.ringbell,
                        addressDto.floor,
                        user_id
                        ];
        return await this.AddressRepository.query(query,values);
    }
    async CheckAddressExistanceById(id: string,user_id: string):Promise<boolean>{
        const query = `SELECT EXISTS (SELECT 1 FROM "ProfessionalUser" WHERE id = $1 AND "userId" = $2 LIMIT 1) AS match_found;`;
        return (await this.AddressRepository.query(query,[id,user_id]))[0];  
    }

    async GetAddressById(id: string,user_id : string):Promise<Address>{
        const query = `SELECT id,address,number,zipcode,city,phonenumber,ringbell,floor FROM "Address"
                       WHERE id = $1 AND "userId" = $2 LIMIT 1;`;
                    
        return (await this.AddressRepository.query(query,[id,user_id]))[0];
    }

    async GetAllByUserId(user_id: string):Promise<Address[]>{
        const query = `SELECT id,address,number,zipcode,city,phonenumber,ringbell,floor FROM "Address"
                       WHERE "userId" = $1;`;
        return await this.AddressRepository.query(query,[user_id]);
    }

    async UpdateAddressById(id: string, user_id : string,addressDto : AddressEdit):Promise<void>{
        const updateClauses = [];
        const values: any[] = [id,user_id];
        if(addressDto.address != null)
        {
            updateClauses.push(`address = $${values.length + 1}`);
            values.push(addressDto.address);
        }
        if(addressDto.city != null)
        {
            updateClauses.push(`city = $${values.length + 1}`);
            values.push(addressDto.city); 
        }
        if(addressDto.floor != null)
        {
            updateClauses.push(`floor = $${values.length + 1}`);
            values.push(addressDto.floor); 
        }
        if(addressDto.number != null)
        {
            updateClauses.push(`number = $${values.length + 1}`);
            values.push(addressDto.number); 
        }
        if(addressDto.phonenumber != null)
        {
            updateClauses.push(`phonenumber = $${values.length + 1}`);
            values.push(addressDto.phonenumber); 
        }
        if(addressDto.ringbell != null)
        {
            updateClauses.push(`ringbell = $${values.length + 1}`);
            values.push(addressDto.ringbell); 
        }
        if(addressDto.zipcode != null)
        {
            updateClauses.push(`zipcode = $${values.length + 1}`);
            values.push(addressDto.zipcode); 
        }

        if(updateClauses.length == 0)
            throw new UnauthorizedException("Please make some changes before submitting!");

        const query = `UPDATE "Address"
                       SET ${updateClauses.join(`,`)}
                       WHERE id = $1 AND "userId" = $2;`;

        return await this.AddressRepository.query(query,values);
    }

    async DeleteAddressById(id: string,user_id : string):Promise<void>{
        const query = `DELETE FROM "Address"
                       WHERE id = $1 AND "userId" = $2;`;
                       
        return await this.AddressRepository.query(query,[id,user_id]);
    }
}