import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { PassportStrategy } from "@nestjs/passport"
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from 'passport-jwt'
import { User } from "../Entities/user/user.entity";
import { Repository } from "typeorm";
import { ProfessionalJwtPayload } from "../Entities/jwt-payload.interface";

@Injectable()
export class UserJwtStrategy extends PassportStrategy(Strategy){
    constructor(    
        @InjectRepository(User)
        private userRepository: Repository<User>){
            super({
                secretOrKey: 'topSecret52',
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            });
        }
    async validate(payload: ProfessionalJwtPayload):Promise<User | boolean>{
        const { id } = payload;
        const user = await this.userRepository.findOne({where: [{id}]});
        if(!user)
            return false;
        return user;
    }
}




