import { Controller,Post,Body, Get, UseGuards} from '@nestjs/common';
import { AuthSignIn } from 'src/Entities/authsignin.entity';
import { User } from 'src/Entities/user/user.entity';
import { UserDto } from 'src/Entities/user/UserDto';
import { UserService } from 'src/Services/user/user.service';
import { GetUser } from 'src/get-user.decorator';
import { UserEdit } from 'src/Entities/user/useredit.entity';
import { UserGuard } from 'src/Guards/user.guard';
import { UserPasswordEdit } from 'src/Entities/user/user_password_edit.entity';
import { RefreshUserGuard } from 'src/Guards/user_refresh.guard';
import { FormDataRequest } from 'nestjs-form-data';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  @FormDataRequest()
  async Create(@Body() userDto: UserDto): Promise<{accesstoken: string,refreshtoken: string} | string[]>
  {
    console.log(userDto);
    return this.userService.Create(userDto);
  }

  @Post('signin')
  @FormDataRequest()
  async SignIn(@Body() userDto: AuthSignIn): Promise<{accesstoken: string,refreshtoken: string}>
  {
    return this.userService.SignIn(userDto);
  }

  @Post('edit')
  @FormDataRequest()
  @UseGuards(UserGuard)
  async Edit(@GetUser() user: User,@Body() userDto: UserEdit): Promise <{accesstoken: string}>
  {
    return this.userService.Edit(user,userDto);
  }

  @Post('edit/password')
  @FormDataRequest()
  @UseGuards(UserGuard)
  async EditPassword(@GetUser() user: User,@Body() userDto: UserPasswordEdit): Promise <void>
  {
    return this.userService.EditPassword(user.id,userDto);
  }

  @Post('refresh')
  @UseGuards(RefreshUserGuard)
  async RefreshToken(@GetUser() user: User):Promise<{accesstoken: string}>
  {
    return this.userService.RefreshToken(user);
  }
}
