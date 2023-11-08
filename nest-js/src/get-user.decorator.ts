import { createParamDecorator,ExecutionContext} from "@nestjs/common";
import { User } from "./Entities/user/user.entity";
import { ProfessionalUser } from "./Entities/professional_user/professionaluser.entity";
import { FranchiseUser } from "./Entities/franchise_user/franchise_user.entity";

export const GetUser = createParamDecorator(
    (_data ,ctx: ExecutionContext): User | ProfessionalUser | FranchiseUser => {
        const req = ctx.switchToHttp().getRequest();
        return req.user;
    }
);