import { Controller,Body,Post,Get,UseGuards, UseInterceptors, ParseFilePipe, FileTypeValidator } from '@nestjs/common';
import { FranchiseUserService } from 'src/Services/franchise_user/franchise_user.service';
import { AuthSignIn } from 'src/Entities/authsignin.entity';
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

@Controller('franchiseuser')
export class FranchiseUserController {
    constructor(private readonly userService: FranchiseUserService,
                private readonly professionaluserService: ProfessionalUserService) {}

    @Post('create')
    @UseInterceptors(FileInterceptor('image'))
    async Create(@Body() userDto: FranchiseUserDto,@UploadedFile(new ParseFilePipe({validators: [new FileTypeValidator({ fileType: 'image/jpeg'})]}))file:  Express.Multer.File): Promise<string[] | void>
    {
      const errors = await this.userService.UserExists(userDto);
      if(errors.length > 0)
        return errors
      this.userService.Create(userDto,file.buffer);
    }
  
    @Get('signin')
    async SignIn(@Body() userDto: AuthSignIn): Promise<{accessToken: string}>
    {
      return this.userService.SignIn(userDto);
    }

    @Post('edit')
    @UseGuards(FranchiseGuard)
    async Edit(@GetUser() franchiseUser: FranchiseUser,@Body() userDto: FranchiseUserEdit): Promise<{accessToken: string}>
    {
      return this.userService.Edit(franchiseUser.id,userDto);
    }

    @Post('edit/profile-picture')
    @UseInterceptors(FileInterceptor('image'))
    @UseGuards(FranchiseGuard)
    async EditPicture(@GetUser() franchiseUser: FranchiseUser,@UploadedFile(new ParseFilePipe({validators: [new FileTypeValidator({ fileType: 'image/jpeg'})]}))file:  Express.Multer.File): Promise<void>
    {
      return this.userService.EditPicture(franchiseUser.id,file.buffer);
    }

    @Post('professionaluser/create')
    @UseGuards(FranchiseGuard)
    @UseInterceptors(FileInterceptor('image'))
    async CreateProfessionalUser(@GetUser() franchiseuser: FranchiseUser,@Body() userDto: ProfessionalUserDto,@UploadedFile(new ParseFilePipe({validators: [new FileTypeValidator({ fileType: 'image/jpeg'})]}))file:  Express.Multer.File) : Promise<string[] | void>
    {
      this.professionaluserService.FranchiseCreate(userDto,franchiseuser,file.buffer);
    }

    @Get('professionaluser/signin')
    @UseGuards(FranchiseGuard)
    async SignInProfessionalUser(@GetUser() userDto: FranchiseUser,@Body() username: string): Promise<{accessToken: string}>
    {
      return this.professionaluserService.FranchsiseSignIn(userDto,username);
    }

    @Post('professionaluser/edit')
    @UseGuards(ProfessionalGuard)
    async EditProfessionalUser(@GetUser() professionalUser: ProfessionalUser,@Body() userDto: ProfessionalUserEdit): Promise<{accessToken: string}>
    {
      return this.professionaluserService.Edit(professionalUser.id,userDto);
    }

    @Post('professionaluser/edit/profile-picture')
    @UseInterceptors(FileInterceptor('image'))
    @UseGuards(ProfessionalGuard)
    async EditProfessionalPicture(@GetUser() professionalUser: ProfessionalUser,@UploadedFile(new ParseFilePipe({validators: [new FileTypeValidator({ fileType: 'image/jpeg'})]}))file:  Express.Multer.File): Promise<void>
    {
      return this.professionaluserService.FranchiseEditPicture(professionalUser.id,file.buffer);
    }

}
