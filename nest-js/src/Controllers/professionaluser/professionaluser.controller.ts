import { Controller,Post,Param,Get, Body,UseGuards,UseInterceptors,ParseFilePipe, FileTypeValidator, UsePipes  } from '@nestjs/common';
import { AuthSignIn } from 'src/Entities/authsignin.entity';
import { ProfessionalUserDto } from 'src/Entities/professional_user/professional_userDto.entity';
import { ProfessionalUserService } from 'src/Services/professional-user/professional-user.service';
import { GetUser } from 'src/get-user.decorator';
import { ProfessionalUser } from 'src/Entities/professional_user/professionaluser.entity';
import { ProfessionalUserEdit } from 'src/Entities/professional_user/professional_userEdit.entity';
import { ProfessionalGuard } from 'src/Guards/professional.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile } from '@nestjs/common';
import { diskStorage } from 'multer';
import { ProfessionalUserPasswordEditDto } from 'src/Entities/professional_user/professional_user_password_edit.entity';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { ValidationPipe } from '@nestjs/common/pipes';
import { UserGuard } from 'src/Guards/user.guard';
import { RefreshProfessionalGuard } from 'src/Guards/professional_refresh.guard';


const storage = {
  storage: diskStorage({
    destination: './uploads/profileimages',
    filename: (req,file,cb) => {
      const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;

      cb(null,`${filename}${extension}`)
    }
  })
}

@Controller('professionaluser')
export class ProfessionalUserController {
    constructor(private readonly userService: ProfessionalUserService){}

   @Post('register')
   @UsePipes(new ValidationPipe())
   @UseInterceptors(FileInterceptor('image',storage))
   async Create(@Body() userDto: ProfessionalUserDto,@UploadedFile() file):Promise<{accesstoken: string, refreshtoken:string} | string[]>
   {
        return this.userService.Create(userDto,file.path);
   }

   @Get('signin')
   async SignIn(@Body() userDto: AuthSignIn):Promise<{accesstoken: string , refreshtoken: string}>
   {
        return this.userService.SignIn(userDto);
   }

   @Post('edit')
   @UseGuards(ProfessionalGuard)
   async Edit(@GetUser() professionalUser: ProfessionalUser,@Body() userDto: ProfessionalUserEdit): Promise <{accesstoken: string} | string[]>
   {
     return this.userService.Edit(professionalUser.id,userDto);
   }

   @Post('edit/image')
   @UseGuards(ProfessionalGuard)
   @UseInterceptors(FileInterceptor('image',storage))
   async EditImage(@GetUser() professionalUser: ProfessionalUser,@UploadedFile() file):Promise<void>
   {
    return this.userService.EditImageById(professionalUser,file.path);
   }

   @Post('edit/password')
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
