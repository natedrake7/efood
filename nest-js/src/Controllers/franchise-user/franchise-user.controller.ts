import { Controller,Body,Post,Get,UseGuards } from '@nestjs/common';
import { FranchiseUserService } from 'src/Services/franchise_user/franchise_user.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthSignIn } from 'src/Entities/authsignin.entity';
import { FranchiseUserDto } from 'src/Entities/franchise_user/franchise_userdto.entity';
import { FranchiseUser } from 'src/Entities/franchise_user/franchise_user.entity';
import { GetUser } from 'src/get-user.decorator';
import { ProfessionalUserService } from 'src/Services/professional-user/professional-user.service';
import { ProfessionalUser } from 'src/Entities/professional_user/professionaluser.entity';
import { ProfessionalUserDto } from 'src/Entities/professional_user/professional_userDto.entity';
import { ProfessionalUserEdit } from 'src/Entities/professional_user/professional_userEdit.entity';
import { FranchiseUserEdit } from 'src/Entities/franchise_user/franchise_userEdit.entity';

@Controller('franchiseuser')
export class FranchiseUserController {
    constructor(private readonly userService: FranchiseUserService,
                private readonly professionaluserService: ProfessionalUserService) {}

    @Post('create')
    async Create(@Body() userDto: FranchiseUserDto): Promise<string[] | void>
    {
      const errors = await this.userService.UserExists(userDto);
      if(errors.length > 0)
        return errors
      this.userService.Create(userDto);
    }
  
    @Get('signin')
    async SignIn(@Body() userDto: AuthSignIn): Promise<{accessToken: string}>
    {
      return this.userService.SignIn(userDto);
    }

    @Post('edit')
    @UseGuards(AuthGuard())
    async Edit(@GetUser() franchiseUser: FranchiseUser,@Body() userDto: FranchiseUserEdit): Promise<{accessToken: string}>
    {
      return this.userService.Edit(franchiseUser.id,userDto);
    }

    @Post('professionaluser/create')
    @UseGuards(AuthGuard())
    async CreateProfessionalUser(@GetUser() franchiseuser: FranchiseUser,@Body() userDto: ProfessionalUserDto) : Promise<string[] | void>
    {
      this.professionaluserService.FranchiseCreate(userDto,franchiseuser);
    }

    @Get('professionaluser/signin')
    @UseGuards(AuthGuard())
    async SignInProfessionalUser(@GetUser() userDto: FranchiseUser,@Body() username: string): Promise<{accessToken: string}>
    {
      return this.professionaluserService.FranchsiseSignIn(userDto,username);
    }

    @Post('professionaluser/edit')
    @UseGuards(AuthGuard())
    async EditProfessionalUser(@GetUser() professionalUser: ProfessionalUser,@Body() userDto: ProfessionalUserEdit): Promise<{accessToken: string}>
    {
      return this.professionaluserService.Edit(professionalUser.id,userDto);
    }
}
