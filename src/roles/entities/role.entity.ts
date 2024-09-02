import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { IsString } from '@nestjs/class-validator';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @Column()
  name: string;

  @OneToMany(() => User, (user) => user.role_id)
  users: User[];
}
