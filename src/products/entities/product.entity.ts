import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  DeleteDateColumn,
} from 'typeorm';
import { IsString, IsPositive, IsOptional } from '@nestjs/class-validator';
import { Category } from 'src/categories/entities/category.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @Column({ unique: true })
  name: string;

  @IsPositive()
  @Column()
  price: number;

  @IsString()
  @Column()
  description: string;

  @IsOptional()
  @Column({ nullable: true })
  image?: string;

  @IsPositive()
  @Column()
  stock: number;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @Column({ default: null })
  createdAt: Date;

  @Column({ default: null })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
