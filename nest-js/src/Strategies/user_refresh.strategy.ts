import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from 'passport-jwt'
import { RefreshJwtPayload } from "../Entities/jwt-payload.interface";
import { ConfigService } from '@nestjs/config/dist';
import { User } from "src/Entities/user/user.entity";
import { UserQueries } from "src/DbQueries/UserQueries";

@Injectable()
export class RefreshUserJwtStrategy extends PassportStrategy(Strategy, 'jwt-refresh'){
    constructor(private readonly Queries: UserQueries,
                private configService: ConfigService){
            super({
                secretOrKey: configService.get('JWT_SECRET'),
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            });
        }
    async validate(payload: RefreshJwtPayload):Promise<boolean | User>{
        const user = await this.Queries.GetUserById(payload.id);
        if(!user)
            return false;
        return user;
    }
}