import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
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

  @Column({ default: new Date(), nullable: true })
  created_at: Date;

  @Column({ default: null })
  updated_at: Date;

  @DeleteDateColumn({ default: null })
  deleted_at: Date;
}
