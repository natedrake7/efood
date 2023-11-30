import { Controller,Body,Post,Get,UseGuards, UseInterceptors, ParseFilePipe, FileTypeValidator, UsePipes } from '@nestjs/common';
import { FranchiseUserService } from 'src/Services/franchise_user/franchise_user.service';
import { AuthSignIn, FranchiseProfessionalSignIn } from 'src/Entities/authsignin.entity';
import { FranchiseUserDto } from 'src/Entities/franchise_user/franchise_userdto.entity';
import { FranchiseUser } from 'src/Entities/franchise_user/franchise_user.entity';
import { GetUser } from 'src/get-user.decorator';
import { ProfessionalUserService } from 'src/Services/professional-user/professional-user.service';
import { ProfessionalUser } from 'src/Entities/professional_user/professionaluser.entity';
import { ProfessionalUserDto } from 'src/Entities/professional_user/professional_userDto.entity';
import { ProfessionalUserEdit } from 'src/Entities/professional_user/professional_userEdit.entity';
import { FranchiseUserEdit } from 'src/Entities/franchise_user/franchise_userEdit.entity';
import { FranchiseGuard } from 'src/Guards/franchise.guard';
import { ProfessionalGuard } from 'src/Guards/professional.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile } from '@nestjs/common';
import { FranchiseUserPasswordEdit } from 'src/Entities/franchise_user/franchise_user_password_edit.entity';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { diskStorage } from 'multer';
import { ValidationPipe } from '@nestjs/common';
import { RefreshFranchiseGuard } from 'src/Guards/franchise_refresh.guard';
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

@Controller('franchiseuser')
export class FranchiseUserController {
    constructor(private readonly userService: FranchiseUserService,
                private readonly professionaluserService: ProfessionalUserService) {}

    @Post('create')
    @UsePipes(new ValidationPipe())
    @UseInterceptors(FileInterceptor('image',storage))
    async Create(@Body() userDto: FranchiseUserDto,@UploadedFile() file): Promise<{accesstoken: string,refreshtoken: string} | string[]>
    {
      return this.userService.Create(userDto,file.path);
    }
  
    @Get('signin')
    async SignIn(@Body() userDto: AuthSignIn): Promise<{accesstoken: string,refreshtoken: string}>
    {
      return this.userService.SignIn(userDto);
    }

    @Post('edit')
    @UseGuards(FranchiseGuard)
    async Edit(@GetUser() franchiseUser: FranchiseUser,@Body() userDto: FranchiseUserEdit): Promise<{accesstoken: string} | string[]>
    {
      return this.userService.Edit(franchiseUser.id,userDto);
    }

    @Post('edit/image')
    @UseInterceptors(FileInterceptor('image',storage))
    @UseGuards(FranchiseGuard)
    async EditPicture(@GetUser() franchiseUser: FranchiseUser,@UploadedFile() file): Promise<void>
    {
      return this.userService.EditImageById(franchiseUser,file.path);
    }

    @Post('edit/password')
    @UseGuards(FranchiseGuard)
    async EditPassword(@GetUser() franchiseUser: FranchiseUser,@Body() userDto: FranchiseUserPasswordEdit):Promise<void>
    {
      return this.userService.EditPassword(franchiseUser.id,userDto);
    }

    @Post('professionaluser/create')
    @UseGuards(FranchiseGuard)
    @UsePipes(new ValidationPipe())
    @UseInterceptors(FileInterceptor('image',storage))
    async CreateProfessionalUser(@GetUser() franchiseuser: FranchiseUser,@Body() userDto: ProfessionalUserDto,@UploadedFile() file) : Promise<{accesstoken: string, refreshtoken:string} | string[]>
    {
      return this.professionaluserService.FranchiseCreate(userDto,franchiseuser.id,file.path);
    }

    @Get('professionaluser/signin')
    @UseGuards(FranchiseGuard)
    async SignInProfessionalUser(@GetUser() userDto: FranchiseUser,@Body() authSignIn: FranchiseProfessionalSignIn): Promise<{accesstoken: string, refreshtoken:string}>
    {
      return this.professionaluserService.FranchsiseSignIn(userDto.id,authSignIn);
    }

    @Post('professionaluser/edit')
    @UseGuards(ProfessionalGuard)
    async EditProfessionalUser(@GetUser() professionalUser: ProfessionalUser,@Body() userDto: ProfessionalUserEdit): Promise<{accesstoken: string} | string[]>
    {
      return this.professionaluserService.Edit(professionalUser.id,userDto);
    }

    @Post('professionaluser/edit/profile-picture')
    @UseGuards(ProfessionalGuard)
    @UseInterceptors(FileInterceptor('image',storage))
    async EditProfessionalPicture(@GetUser() professionalUser: ProfessionalUser,@UploadedFile() file): Promise<void>
    {
      return this.professionaluserService.EditImageById(professionalUser,file.path);
    }

    @Post('refresh')
    @UseGuards(RefreshFranchiseGuard)
    async RefreshToken(@GetUser() user: FranchiseUser):Promise<{accesstoken: string}>
    {
      return this.userService.RefreshToken(user);
    }

    @Post('professionaluser/refresh')
    @UseGuards(RefreshProfessionalGuard)
    async RefreshProfessionalToken(@GetUser() user: ProfessionalUser):Promise<{accesstoken: string}>
    {
      return this.professionaluserService.RefreshToken(user);
    }

}
