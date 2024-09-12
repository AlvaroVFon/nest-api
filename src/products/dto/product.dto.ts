import { Category } from 'src/categories/entities/category.entity';
import { CreateProductDto } from './create-product.dto';
import { UpdateProductDto } from './update-product.dto';

export class ProductDto {
  id?: number;
  name: string;
  price: number;
  description: string;
  image?: string;
  stock: number;
  category: Category;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  static fromRequest(
    productDto: CreateProductDto | UpdateProductDto,
    category: Category,
  ): ProductDto {
    return {
      name: productDto.name,
      price: productDto.price,
      description: productDto.description,
      image: productDto.image,
      stock: productDto.stock,
      category,
    };
  }

  static fromSchemaToPublic(product: ProductDto): ProductDto {
    return {
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image,
      stock: product.stock,
      category: product.category,
    };
  }
}
