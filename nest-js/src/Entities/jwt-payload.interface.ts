export interface JwtPayload{
    id: number;

    username: string;

    firstname: string;

    lastname: string;

    email: string;

    phonenumber: string;
}

export interface ProfessionalJwtPayload{
    id: number;

    username: string;

    address: string;

    description: string;

    email: string;

    phonenumber: string;
}