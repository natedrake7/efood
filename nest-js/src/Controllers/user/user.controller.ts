import { Controller,Post,Body,Delete,Param, Get, UseGuards} from '@nestjs/common';
import { AuthSignIn } from 'src/Entities/authsignin.entity';
import { User } from 'src/Entities/user/user.entity';
import { UserDto } from 'src/Entities/user/UserDto';
import { UserService } from 'src/Services/user/user.service';
import { GetUser } from 'src/get-user.decorator';
import { UserEdit } from 'src/Entities/user/useredit.entity';
import { UserGuard } from 'src/Guards/user.guard';
import { UserPasswordEdit } from 'src/Entities/user/user_password_edit.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async Create(@Body() userDto: UserDto): Promise<string | string[]>
  {
    return this.userService.Create(userDto);
  }

  @Get('signin')
  async SignIn(@Body() userDto: AuthSignIn): Promise<string>
  {
    return this.userService.SignIn(userDto);
  }

  @Post('edit')
  @UseGuards(UserGuard)
  async Edit(@GetUser() user: User,@Body() userDto: UserEdit): Promise <string>
  {
    return this.userService.Edit(user.id,userDto);
  }

  @Post('edit/password')
  @UseGuards(UserGuard)
  async EditPassword(@GetUser() user: User,@Body() userDto: UserPasswordEdit): Promise <void>
  {
    return this.userService.EditPassword(user.id,userDto);
  }
}
