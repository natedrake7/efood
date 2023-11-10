import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository} from 'typeorm';
import { Address } from 'src/Entities/addresses/address.entity';
import { AddressDto } from 'src/Entities/addresses/addressDto.entity';
import { User } from 'src/Entities/user/user.entity';
import { AddressEdit } from 'src/Entities/addresses/address_edit.entity';

@Injectable()
export class AddressService{
    constructor(@InjectRepository(Address)
                private address_repository: Repository<Address>){}

    async AddAddress(user : User,addressDto : AddressDto):Promise<void>{
        if(!user)
            throw new UnauthorizedException("User is not registered!");
        const {address,number,zipcode,floor,city,ringbell,phonenumber} = addressDto;

        const new_address = this.address_repository.create({
            address,
            number,
            zipcode,
            floor,
            city,
            ringbell,
            phonenumber,
            user
        });
        await this.address_repository.save(new_address);
    }

    async EditAddress(id : string,addressDto : AddressEdit,user: User):Promise<void>{
        const address = await this.address_repository.findOneBy({id,user});

        if(!address)
            throw new UnauthorizedException("Address doesn't exist!");

        if(address.address != addressDto.address && addressDto != null)
            address.address = addressDto.address;
        if(address.city != addressDto.city && addressDto.city != null)
            address.city = addressDto.city;
        if(address.floor != addressDto.floor && addressDto.floor != null)
            address.floor = addressDto.floor;
        if(address.number != addressDto.number && addressDto.number != null)
            address.number = addressDto.number;
        if(address.ringbell != addressDto.ringbell && addressDto.ringbell != null)
            address.ringbell = addressDto.ringbell;
        if(address.phonenumber != addressDto.phonenumber && addressDto.phonenumber != null)
            address.phonenumber = addressDto.phonenumber;
        if(address.zipcode != addressDto.zipcode && addressDto.zipcode != null)
            address.zipcode = addressDto.zipcode;

        await this.address_repository.save(address);    
    }

    async GetAddressesByUser(user: User):Promise<void | Address[]>{
        const addresses = await this.address_repository.findBy({user});

        if(!addresses)
            throw new UnauthorizedException("User has not addresses!");
    
        return addresses;
    }

    async GetAddress(id : string,user : User):Promise<void | Address>{
        const address = await this.address_repository.findOneBy({id,user});

        if(!address)
            throw new UnauthorizedException("Address doesn't exist!");
        console.log(address.user);
        return address;
    }

    async DeleteAddress(id : string,user: User):Promise<void>{
        const address = await this.address_repository.findOneBy({id,user});

        if(!address)
            throw new UnauthorizedException("Address doesn't exist!");

        await this.address_repository.delete(address);
    }

}
