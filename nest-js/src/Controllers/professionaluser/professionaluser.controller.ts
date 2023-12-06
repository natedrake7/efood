import { Controller,Post,Param,Get, Body,UseGuards,UseInterceptors, UsePipes  } from '@nestjs/common';
import { AuthSignIn } from 'src/Entities/authsignin.entity';
import { ProfessionalUserDto } from 'src/Entities/professional_user/professional_userDto.entity';
import { ProfessionalUserService } from 'src/Services/professional-user/professional-user.service';
import { GetUser } from 'src/get-user.decorator';
import { ProfessionalUser } from 'src/Entities/professional_user/professionaluser.entity';
import { ProfessionalUserEdit } from 'src/Entities/professional_user/professional_userEdit.entity';
import { ProfessionalGuard } from 'src/Guards/professional.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile } from '@nestjs/common';
import { ProfessionalUserPasswordEditDto } from 'src/Entities/professional_user/professional_user_password_edit.entity';
import { ValidationPipe } from '@nestjs/common/pipes';
import { UserGuard } from 'src/Guards/user.guard';
import { RefreshProfessionalGuard } from 'src/Guards/professional_refresh.guard';
import { FormDataRequest } from 'nestjs-form-data';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadedFiles } from '@nestjs/common/decorators';


@Controller('professionaluser')
export class ProfessionalUserController {
    constructor(private readonly userService: ProfessionalUserService){}

   @Post('register')
   @UsePipes(new ValidationPipe())
   @UseInterceptors(FilesInterceptor('images', 2))
   async Create(@Body() userDto: ProfessionalUserDto,@UploadedFiles() files):Promise<{accesstoken: string, refreshtoken:string} | string[]>
   {

        return this.userService.Create(userDto,files[1].path,files[0].path);
   }

   @Post('signin')
   @FormDataRequest()
   async SignIn(@Body() userDto: AuthSignIn):Promise<{accesstoken: string , refreshtoken: string}>
   {
        return this.userService.SignIn(userDto);
   }

   @Post('edit')
   @FormDataRequest()
   @UseGuards(ProfessionalGuard)
   async Edit(@GetUser() professionalUser: ProfessionalUser,@Body() userDto: ProfessionalUserEdit): Promise <{accesstoken: string} | string[]>
   {
     return this.userService.Edit(professionalUser.id,userDto);
   }

   @Post('edit/profile-image')
   @UseGuards(ProfessionalGuard)
   @UseInterceptors(FileInterceptor('image'))
   async EditProfileImage(@GetUser() professionalUser: ProfessionalUser,@UploadedFile() file):Promise<void>
   {
    return this.userService.EditImageById(professionalUser,file.path);
   }

   @Post('edit/background-image')
   @UseGuards(ProfessionalGuard)
   @UseInterceptors(FileInterceptor('image'))
   async EditBackgroundImage(@GetUser() professionalUser: ProfessionalUser,@UploadedFile() file):Promise<void>
   {
    return this.userService.EditImageById(professionalUser,file.path,true);
   }

   @Post('edit/password')
   @FormDataRequest()
   @UseGuards(ProfessionalGuard)
   async EditPassword(@GetUser() professionalUser: ProfessionalUser,@Body() userDto: ProfessionalUserPasswordEditDto): Promise <void>
   {
     return this.userService.EditPassword(professionalUser.id,userDto);
   }

   @Get('get/:id')
   @UseGuards(UserGuard)
   async Get(@Param('id') id: string):Promise<ProfessionalUser>
   {
     return this.userService.GetById(id);
   }

   @Get('get')
   @UseGuards(UserGuard)
   async GetAll():Promise<void | ProfessionalUser[]>
   {
     return this.userService.GetAll();
   }

   @Post('refresh')
   @UseGuards(RefreshProfessionalGuard)
   async RefreshToken(@GetUser() user: ProfessionalUser):Promise<{accesstoken: string}>
   {
      return this.userService.RefreshToken(user);
   }

}
