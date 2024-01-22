import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Address } from 'src/Entities/addresses/address.entity';
import { AddressDto } from 'src/Entities/addresses/addressDto.entity';
import { User } from 'src/Entities/user/user.entity';
import { AddressEdit } from 'src/Entities/addresses/address_edit.entity';
import { AddressQueries } from 'src/DbQueries/AddressQueries';
import { isPhoneNumber, maxLength, minLength } from 'class-validator';
import { BadRequestException } from '@nestjs/common/exceptions';

@Injectable()
export class AddressService{
    constructor(private Queries:  AddressQueries){}
    
    async AddAddress(user : User,addressDto : AddressDto):Promise<void>{
        if(!user)
            throw new UnauthorizedException("User is not registered!");

        return await this.Queries.CreateAddress(user.id,addressDto);
    }

    async EditAddressById(id : string,addressDto : AddressEdit,user: User):Promise<{property: string,message:string}[] | void>{
        if(!user)
            throw new UnauthorizedException("User is not registered!");
        
        const address = this.Queries.GetAddressById(id,user.id);
        
        if(!address)
            throw new BadRequestException("No address with that ID exists!");

        const errors = this.ValidateEditAddressDto(addressDto);

        if(errors.length > 0)
            return errors;

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

    ValidateEditAddressDto(addressDto : AddressEdit):{property: string,message:string}[]{
        const errors:{property: string,message:string}[] = [];

        if(addressDto.phonenumber != null && !isPhoneNumber(addressDto.phonenumber))
            errors.push({property:'phonenumber',message:'Invalid Phonenumber (specify region e.g +30 6944444444)!'});
        if(addressDto.address != null && (!minLength(addressDto.address,3) || !maxLength(addressDto.address,40)))
            errors.push({property:'address',message:'Address length must be between 3-40 characters!'});
        if(addressDto.number != null && (!minLength(addressDto.number,1) || !maxLength(addressDto.number,10)))
            errors.push({property:'number',message:'Address number length must be between 1-10 characters!'});
        if(addressDto.zipcode != null && (!minLength(addressDto.zipcode,5) || !maxLength(addressDto.zipcode,10)))
            errors.push({property:'zipcode',message:'Zipcode length must be between 5-10 characters!'});
        if(addressDto.city != null && (!minLength(addressDto.city,3) || !maxLength(addressDto.city,10)))
            errors.push({property:'city',message:'City must be between 3-10 characters!'});
        if(addressDto.ringbell != null && (!minLength(addressDto.ringbell,4) || !maxLength(addressDto.ringbell,20)))
            errors.push({property:'ringbell',message:'Ringbell name must be between 1-10 characters!'});
        if(addressDto.floor != null && (addressDto.floor < 0 || addressDto.floor > 20))
            errors.push({property:'floor',message:'Floor must be between must be between 0-20!'});

        return errors;
    }

}
