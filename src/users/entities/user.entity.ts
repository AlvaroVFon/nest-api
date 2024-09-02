import { Role } from 'src/roles/entities/role.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { IsString, IsEmail, IsNumber } from '@nestjs/class-validator';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @Column()
  name: string;

  @IsEmail()
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @IsNumber()
  @ManyToOne(() => Role, (role) => role.users)
  @Column()
  role_id: number;

  @Column({ default: new Date() })
  created_at: Date;

  @Column({ default: null })
  updated_at: Date;
}
