import { Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity('User')
export class User{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({length: 100})
    username: string;

    @Column({length: 100})
    firstname: string;

    @Column({length: 100})
    lastname: string;

    @Column({length: 100})
    password: string;

    @Column({length: 100})
    email: string;

    @Column()
    phonenumber: string;
}