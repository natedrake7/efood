import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { PassportStrategy } from "@nestjs/passport"
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Repository } from "typeorm";
import { ProfessionalJwtPayload } from "../Entities/jwt-payload.interface";
import { ProfessionalUser } from "../Entities/professional_user/professionaluser.entity";

@Injectable()
export class ProfesionalJwtStrategy extends PassportStrategy(Strategy){
    constructor(    
        @InjectRepository(ProfessionalUser)
        private professionalRepository: Repository<ProfessionalUser>){
            super({
                secretOrKey: 'topSecret52',
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            });
        }
    async validate(payload: ProfessionalJwtPayload):Promise<ProfessionalUser | boolean>{
        const { id } = payload;
        const user = await this.professionalRepository.findOne({where: [{id}]});
        if(!user)
            return false;
        return user;
    }
}