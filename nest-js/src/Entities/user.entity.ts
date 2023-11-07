import { Entity, Column, PrimaryGeneratedColumn,OneToMany} from 'typeorm';
import { Restaurant } from './restaurant.entity';

@Entity('User')
export class User{
    @PrimaryGeneratedColumn()
    id: number;

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

    @Column({length:10})
    role: string;

    @OneToMany(() => Restaurant,(restaurant) => restaurant.owner)
    restaurants: Restaurant[];
}