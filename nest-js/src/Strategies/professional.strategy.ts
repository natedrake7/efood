import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { PassportStrategy } from "@nestjs/passport"
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Repository } from "typeorm";
import { ProfessionalJwtPayload } from "../Entities/jwt-payload.interface";
import { ProfessionalUser } from "../Entities/professional_user/professionaluser.entity";
import { ProfessionalUserQueries } from "src/DbQueries/ProfessionalUserQueries";

@Injectable()
export class ProfesionalJwtStrategy extends PassportStrategy(Strategy){
    constructor(private readonly Queries: ProfessionalUserQueries){
            super({
                secretOrKey: 'topSecret52',
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