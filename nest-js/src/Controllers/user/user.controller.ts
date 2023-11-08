import { Controller,Post,Body,Delete,Param, Get, UseGuards} from '@nestjs/common';
import { AuthSignIn } from 'src/Entities/authsignin.entity';
import { User } from 'src/Entities/user/user.entity';
import { UserDto } from 'src/Entities/user/UserDto';
import { UserService } from 'src/Services/user/user.service';
import { AuthGuard } from '@nestjs/passport'
import { GetUser } from 'src/get-user.decorator';
import { UserEdit } from 'src/Entities/user/useredit.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async Create(@Body() userDto: UserDto): Promise<string[] | void>
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
  async Edit(@GetUser() user: User,@Body() userDto: UserEdit): Promise <{accessToken : string} | string>
  {
    return this.userService.Edit(user.id,userDto);
  }

  @Delete('delete')
  @UseGuards(AuthGuard())
  async Delete(@GetUser() userDto: User): Promise<string>
  {
    return this.userService.DeleteUserByID(userDto.id);
  }
}
