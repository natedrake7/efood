import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ProfessionalJwtPayload } from "../Entities/jwt-payload.interface";
import { FranchiseUser } from "../Entities/franchise_user/franchise_user.entity";
import { FranchiseUserQueries } from "src/DbQueries/FranchiseUserQueries";
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FranchiseJwtStrategy extends PassportStrategy(Strategy){
    constructor(private readonly Queries: FranchiseUserQueries,
                private configService: ConfigService){
            super({
                secretOrKey: configService.get('JWT_SECRET'),
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            });
        }
    async validate(payload: ProfessionalJwtPayload):Promise<FranchiseUser | boolean>{
        const { id } = payload;
        const user = await this.Queries.FindUserById(id);
        if(!user)
            return false;
        return user;
    }
}
