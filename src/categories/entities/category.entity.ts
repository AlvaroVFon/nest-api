import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { IsString, IsDate } from '@nestjs/class-validator';
import { Product } from 'src/products/entities/product.entity';
@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @Column({ unique: true })
  name: string;

  @IsString()
  @Column()
  description: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

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
