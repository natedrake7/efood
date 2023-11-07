import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { PassportStrategy } from "@nestjs/passport"
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from 'passport-jwt'
import { User } from "./Entities/user.entity";
import { Repository } from "typeorm";
import { JwtPayload } from "./Entities/jwt-payload.interface";
import { UnauthorizedException } from "@nestjs/common/exceptions";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>){
            super({
                secretOrKey: 'topSecret51',
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            });
        }
    async validate(payload: JwtPayload):Promise<User>{
        const { username } = payload;
        const user  = await this.userRepository.findOne({where: [{username}]});

        if(!user)
            throw new UnauthorizedException("User doesn't exist!");
        return user;
    }
}