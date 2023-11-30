
import {CanActivate,ExecutionContext,Injectable,UnauthorizedException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { RefreshUserJwtStrategy } from 'src/Strategies/user_refresh.strategy';

@Injectable()
export class RefreshUserGuard implements CanActivate {
    constructor(private jwtService: JwtService,
                private jwtStrategy: RefreshUserJwtStrategy,
                private configService: ConfigService) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      if (!token) {
        throw new UnauthorizedException("Unauthorized!");
      }
      const payload = await this.jwtService.verifyAsync(
        token,
        {
           secret: this.configService.get('JWT_SECRET'),
        }
      );
      const user = await this.jwtStrategy.validate(payload);

      if(user === false)
        throw new UnauthorizedException("User is not verified!");
      request['user'] = user;
      
      return true;
    }
  
    private extractTokenFromHeader(request: Request): string | undefined {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    }
  }