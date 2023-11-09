import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { PassportStrategy } from "@nestjs/passport"
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Repository } from "typeorm";
import { ProfessionalJwtPayload } from "../Entities/jwt-payload.interface";
import { FranchiseUser } from "../Entities/franchise_user/franchise_user.entity";

@Injectable()
export class FranchiseJwtStrategy extends PassportStrategy(Strategy){
    constructor(    
        @InjectRepository(FranchiseUser)
        private userRepository: Repository<FranchiseUser>){
            super({
                secretOrKey: 'topSecret52',
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            });
        }
    async validate(payload: ProfessionalJwtPayload):Promise<FranchiseUser | boolean>{
        const { id } = payload;
        const user = await this.userRepository.findOne({where: [{id}]});
        if(!user)
            return false;
        return user;
    }
}
