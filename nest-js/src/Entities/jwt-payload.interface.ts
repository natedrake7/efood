export interface JwtPayload{
    id: string;

    username: string;

    firstname: string;

    lastname: string;

    email: string;

    phonenumber: string;
}

export interface ProfessionalJwtPayload{
    id: string;

    name: string;

    type: string;

    username: string;

    address: string;

    description: string;

    email: string;

    phonenumber: string;

    city: string;

    zipcode: string;
    
    delivery_time: number;
}

export interface FranchiseJwtPayload{
    id: string;

    username: string;

    description: string;

    email: string;

    phonenumber: string;
}

export interface RefreshJwtPayload{
    id: string;

    username: string;
    
    email: string;
}