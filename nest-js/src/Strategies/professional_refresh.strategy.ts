import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from 'passport-jwt'
import { RefreshJwtPayload } from "../Entities/jwt-payload.interface";
import { ConfigService } from '@nestjs/config/dist';
import { ProfessionalUserQueries } from "src/DbQueries/ProfessionalUserQueries";
import { ProfessionalUser } from "src/Entities/professional_user/professionaluser.entity";

@Injectable()
export class RefreshProfessionalJwtStrategy extends PassportStrategy(Strategy, 'jwt-refresh'){
    constructor(private readonly Queries: ProfessionalUserQueries,
                private configService: ConfigService){
            super({
                secretOrKey: configService.get('JWT_SECRET'),
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            });
        }
    async validate(payload: RefreshJwtPayload):Promise<boolean | ProfessionalUser>{
        const user = await this.Queries.GetUserById(payload.id);
        if(!user)
            return false;
        return user;
    }
}