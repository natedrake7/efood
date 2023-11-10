import { Controller,Post,Param,Get, Body,UseGuards,UseInterceptors,ParseFilePipe, FileTypeValidator  } from '@nestjs/common';
import { AuthSignIn } from 'src/Entities/authsignin.entity';
import { ProfessionalUserDto } from 'src/Entities/professional_user/professional_userDto.entity';
import { ProfessionalUserService } from 'src/Services/professional-user/professional-user.service';
import { GetUser } from 'src/get-user.decorator';
import { ProfessionalUser } from 'src/Entities/professional_user/professionaluser.entity';
import { ProfessionalUserEdit } from 'src/Entities/professional_user/professional_userEdit.entity';
import { ProfessionalGuard } from 'src/Guards/professional.guard';
import { ProfessionalUserReturnType } from 'src/Entities/professional_user/professional_user_return_type.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile } from '@nestjs/common';

@Controller('professionaluser')
export class ProfessionalUserController {
    constructor(private readonly userService: ProfessionalUserService){}

   @Post('register')
   @UseInterceptors(FileInterceptor('image'))
   async Create(@Body() userDto: ProfessionalUserDto,@UploadedFile(new ParseFilePipe({validators: [new FileTypeValidator({ fileType: 'image/jpeg'})]}))file:  Express.Multer.File):Promise<string[] | void>
   {
        const errors = await this.userService.UserExists(userDto);
        if(errors.length > 0)
            return errors;
        this.userService.Create(userDto,file.buffer);
   }

   @Get('signin')
   async SignIn(@Body() userDto: AuthSignIn):Promise<{accessToken: string}>
   {
        return this.userService.SignIn(userDto);
   }

   @Post('edit')
   @UseGuards(ProfessionalGuard)
   async Edit(@GetUser() professionalUser: ProfessionalUser,@Body() userDto: ProfessionalUserEdit): Promise <{accessToken : string} | string>
   {
     return this.userService.Edit(professionalUser.id,userDto);
   }

   @Get('get/:id')
   async Get(@Param('id') id: string):Promise<void | ProfessionalUserReturnType>
   {
     return this.userService.Get(id);
   }

   @Get('get')
   async GetAll():Promise<void | ProfessionalUserReturnType[]>
   {
     return this.userService.GetAll();
   }

}
