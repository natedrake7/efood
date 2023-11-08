export interface JwtPayload{
    id: number;

    type: string;

    username: string;

    firstname: string;

    lastname: string;

    email: string;

    phonenumber: string;

    normal_payload: boolean;
}

export interface ProfessionalJwtPayload{
    id: number;

    type: string;

    username: string;

    address: string;

    description: string;

    email: string;

    phonenumber: string;

    city: string;

    zipcode: string;
    
    delivery_time: number;

    professional_payload: boolean;
}

export interface FranchiseJwtPayload{
    id: number;

    type: string;
    
    username: string;

    description: string;

    email: string;

    phonenumber: string;

    franchise_payload: boolean;
}