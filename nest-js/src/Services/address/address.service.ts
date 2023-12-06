import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Address } from 'src/Entities/addresses/address.entity';
import { AddressDto } from 'src/Entities/addresses/addressDto.entity';
import { User } from 'src/Entities/user/user.entity';
import { AddressEdit } from 'src/Entities/addresses/address_edit.entity';
import { AddressQueries } from 'src/DbQueries/AddressQueries';
import { isPhoneNumber } from 'class-validator';
import { BadRequestException } from '@nestjs/common/exceptions';

@Injectable()
export class AddressService{
    constructor(private Queries:  AddressQueries){}
    
    async AddAddress(user : User,addressDto : AddressDto):Promise<void>{
        if(!user)
            throw new UnauthorizedException("User is not registered!");

        return await this.Queries.CreateAddress(user.id,addressDto);
    }

    async EditAddressById(id : string,addressDto : AddressEdit,user: User):Promise<void>{
        if(!user)
            throw new UnauthorizedException("User is not registered!");
        
        const address = this.Queries.GetAddressById(id,user.id);
        
        if(!address)
            throw new BadRequestException("No address with that ID exists!");

        if(addressDto.phonenumber != null && !isPhoneNumber(addressDto.phonenumber))
            throw new BadRequestException("Invalid Phonenumber (specify region e.g +30 6944444444)");

        return await this.Queries.UpdateAddressById(id,user.id,addressDto);
    }

    async GetAddressesByUserId(user: User):Promise<Address[]>{
        if(!user)
            throw new UnauthorizedException("User is not registered!");

        const addresses = await this.Queries.GetAllByUserId(user.id);

        return addresses;
    }

    async GetAddressById(id : string,user : User):Promise<Address>{
        if(!user)
            throw new UnauthorizedException("User is not registered!");

        const address = await this.Queries.GetAddressById(id,user.id);
        
        if(!address)
            throw new BadRequestException("Address doesn't exist!");

        return address;
    }

    async DeleteAddressById(id : string,user: User):Promise<void>{

        const address = await this.Queries.GetAddressById(id,user.id);

        if(!address)
            throw new BadRequestException("Address doesn't exist!");

        return await this.Queries.DeleteAddressById(id,user.id);
    }

}
