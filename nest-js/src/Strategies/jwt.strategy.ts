import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from 'passport-jwt'
import { User } from "../Entities/user/user.entity";
import { JwtPayload} from "../Entities/jwt-payload.interface";
import { UserQueries } from "src/DbQueries/UserQueries";
import { ConfigService } from '@nestjs/config/dist';

@Injectable()
export class UserJwtStrategy extends PassportStrategy(Strategy){
    constructor(private readonly Queries: UserQueries,
                private configService: ConfigService){
            super({
                secretOrKey: configService.get('JWT_SECRET'),
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            });
        }
    async validate(payload: JwtPayload):Promise<User | boolean>{
        const { id } = payload;
        const user = await this.Queries.GetUserById(id);
        if(!user)
            return false;
        return user;
    }
}




