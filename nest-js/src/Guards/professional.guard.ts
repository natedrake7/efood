
import {CanActivate,ExecutionContext,Injectable,UnauthorizedException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ProfesionalJwtStrategy } from 'src/Strategies/professional.strategy';
  
  @Injectable()
  export class ProfessionalGuard implements CanActivate {
    constructor(private jwtService: JwtService,
                private jwtStrategy: ProfesionalJwtStrategy) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      if (!token) {
        throw new UnauthorizedException("Unauthorized!");
      }
      const payload = await this.jwtService.verifyAsync(
        token,
        {
           secret: 'topSecret52'
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