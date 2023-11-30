import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from 'passport-jwt'
import { RefreshJwtPayload } from "../Entities/jwt-payload.interface";
import { ConfigService } from '@nestjs/config/dist';
import { FranchiseUser } from "src/Entities/franchise_user/franchise_user.entity";
import { FranchiseUserQueries } from "src/DbQueries/FranchiseUserQueries";

@Injectable()
export class RefreshFranchiseJwtStrategy extends PassportStrategy(Strategy, 'jwt-refresh'){
    constructor(private readonly Queries: FranchiseUserQueries,
                private configService: ConfigService){
            super({
                secretOrKey: configService.get('JWT_SECRET'),
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            });
        }
    async validate(payload: RefreshJwtPayload):Promise<boolean | FranchiseUser>{
        const user = await this.Queries.FindUserById(payload.id);
        if(!user)
            return false;
        return user;
    }
}