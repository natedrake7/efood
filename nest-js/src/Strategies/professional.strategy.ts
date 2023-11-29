import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ProfessionalJwtPayload } from "../Entities/jwt-payload.interface";
import { ProfessionalUser } from "../Entities/professional_user/professionaluser.entity";
import { ProfessionalUserQueries } from "src/DbQueries/ProfessionalUserQueries";
import { ConfigService } from '@nestjs/config/dist';

@Injectable()
export class ProfesionalJwtStrategy extends PassportStrategy(Strategy){
    constructor(private readonly Queries: ProfessionalUserQueries,
                private configService: ConfigService){
            super({
                secretOrKey: configService.get('JWT_SECRET'),
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            });
        }
    async validate(payload: ProfessionalJwtPayload):Promise<ProfessionalUser | boolean>{
        const { id } = payload;
        const user = await this.Queries.GetUserById(id);
        if(!user)
            return false;
        return user;
    }
}