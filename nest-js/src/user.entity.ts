import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('User')
export class User{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 100})
    username: string;

    @Column({length: 100})
    fistname: string;

    @Column({length: 100})
    lastname: string;

    @Column({length: 100})
    password: string;
}