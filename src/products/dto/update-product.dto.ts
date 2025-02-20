import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  name?: string;
  price?: number;
  description?: string;
  image?: string;
  stock?: number;
  categoryId?: number;
  updatedAt?: Date;
}
