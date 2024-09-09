import { Role } from 'src/roles/entities/role.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
import { IsString, IsEmail, IsNumber } from '@nestjs/class-validator';
import { Cart } from 'src/cart/entities/cart.entity';

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
  role_id: number;

  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart;

  @Column({ default: new Date() })
  created_at: Date;

  @Column({ default: null })
  updated_at?: Date;

  @DeleteDateColumn({ default: null })
  deleted_at?: Date;
}
