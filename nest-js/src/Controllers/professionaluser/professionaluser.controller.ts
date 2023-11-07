import { Controller,Post,Delete,Get, Body } from '@nestjs/common';
import { AuthSignIn } from 'src/Entities/authsignin.entity';
import { ProfessionalUserDto } from 'src/Entities/professional_user/professional_userDto.entity';
import { ProfessionalUserService } from 'src/Services/professional-user/professional-user.service';

@Controller('professionaluser')
export class ProfessionalUserController {
    constructor(private readonly userService: ProfessionalUserService){}
   @Post('register')
   async Create(@Body() userDto: ProfessionalUserDto):Promise<string[] | void>
   {
        const errors = await this.userService.UserExists(userDto);
        if(errors.length > 0)
            return errors;
        this.userService.Create(userDto);
   }

   @Get('signin')
   async SignIn(@Body() userDto: AuthSignIn):Promise<{accessToken: string}>
   {
        return this.userService.SignIn(userDto);
   }
}
