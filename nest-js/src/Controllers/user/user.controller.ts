import { Controller,Post,Body,Delete,Param, Get, UseGuards} from '@nestjs/common';
import { AuthSignIn } from 'src/Entities/authsignin.entity';
import { User } from 'src/Entities/user.entity';
import { UserDto } from 'src/Entities/userDto';
import { UserService } from 'src/Services/user.service';
import { AuthGuard } from '@nestjs/passport'
import { toKebab } from 'postgres';
import { UserEdit } from 'src/Entities/useredit.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async Create(@Body() userDto: UserDto): Promise<User | string[]>
  {
    const errors = await this.userService.UserExists(userDto);
    if(errors.length == 0)
      return this.userService.Create(userDto);
    return errors
  }

  @Get('signin')
  async SignIn(@Body() userDto: AuthSignIn): Promise<{accessToken: string}>
  {
    return this.userService.SignIn(userDto);
  }

  @Post('edit')
  @UseGuards(AuthGuard())
  async Edit(@Body() userDto: UserEdit): Promise <{accessToken : string} | string>
  {
    return this.userService.Edit(userDto);
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard())
  async Delete(@Param('id') id:number): Promise<string | number>
  {
    return this.userService.DeleteUserByID(id);
  }
}
