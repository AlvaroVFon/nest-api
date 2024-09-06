import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
} from 'typeorm';
import { IsString, IsDate } from '@nestjs/class-validator';
@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @Column()
  name: string;

  @IsString()
  @Column()
  description: string;

  //TODO: Add the relation with the product entity

  @IsDate()
  @Column({ default: null })
  created_at: Date;

  @IsDate()
  @Column({ default: null })
  updated_at: Date;

  @IsDate()
  @DeleteDateColumn({ default: null })
  deleted_at: Date;
}
