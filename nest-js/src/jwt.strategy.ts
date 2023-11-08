import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { PassportStrategy } from "@nestjs/passport"
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from 'passport-jwt'
import { User } from "./Entities/user/user.entity";
import { Repository } from "typeorm";
import { FranchiseJwtPayload, JwtPayload, ProfessionalJwtPayload } from "./Entities/jwt-payload.interface";
import { UnauthorizedException } from "@nestjs/common/exceptions";
import { ProfessionalUser } from "./Entities/professional_user/professionaluser.entity";
import { FranchiseUser } from "./Entities/franchise_user/franchise_user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,        
        @InjectRepository(ProfessionalUser)
        private professionalRepository: Repository<ProfessionalUser>,        
        @InjectRepository(FranchiseUser)
        private franchiseRepository: Repository<FranchiseUser>){
            super({
                secretOrKey: 'topSecret51',
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            });
        }
    async validate(payload: JwtPayload | ProfessionalJwtPayload | FranchiseJwtPayload):Promise<User | ProfessionalUser | FranchiseUser>{
        const { id } = payload;
        if(payload.type === 'user')
        {
            const user = await this.userRepository.findOne({where: [{id}]});
            if(!user)
            {
                throw new UnauthorizedException("User is not registered!");
            }
            return user;
        }
        else if(payload.type === 'professional')
        {
            const user = await this.professionalRepository.findOne({where: [{id}]});
            if(!user)
            {
                throw new UnauthorizedException("User is not registered!");
            }
            return user;
        }
        else
        {
            const user = await this.franchiseRepository.findOne({where: [{id}]});
            if(!user)
            {
                throw new UnauthorizedException("User is not registered!");
            }
            return user;
        }
    }
}

