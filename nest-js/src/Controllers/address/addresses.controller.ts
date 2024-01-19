import { Controller,Body,Post,Get,UseGuards, Param } from '@nestjs/common';
import { GetUser } from 'src/get-user.decorator';
import { AddressService } from 'src/Services/address/address.service';
import { User } from 'src/Entities/user/user.entity';
import { UserGuard } from 'src/Guards/user.guard';
import { AddressDto } from 'src/Entities/addresses/addressDto.entity';
import { AddressEdit } from 'src/Entities/addresses/address_edit.entity';
import { Address } from 'src/Entities/addresses/address.entity';
import { FormDataRequest } from 'nestjs-form-data';

@Controller('user/address')
@UseGuards(UserGuard)
export class AddressesController{
    constructor(private readonly addressService: AddressService){}

    @Post('create')
    @FormDataRequest()
    async Create(@GetUser() user:User,@Body() addressDto: AddressDto):Promise<void>{
        return this.addressService.AddAddress(user,addressDto);
    }

    @Post('edit/:id')
    @FormDataRequest()
    async Edit(@Param('id') id: string,@Body() addressDto: AddressEdit,@GetUser() user: User):Promise<void>{
        return this.addressService.EditAddressById(id,addressDto,user);
    }

    @Get('get/:id')
    async GetAddress(@Param('id') id: string,@GetUser() user:User):Promise<Address>{
        return this.addressService.GetAddressById(id,user);
    }

    @Get('get')
    async GetAddressesByUser(@GetUser() user: User):Promise<Address[]>{
        return this.addressService.GetAddressesByUserId(user);
    }

    @Post('delete/:id')
    async DeleteAddress(@Param('id') id : string,@GetUser() user: User):Promise<void>{
        return this.addressService.DeleteAddressById(id,user);
    }
}