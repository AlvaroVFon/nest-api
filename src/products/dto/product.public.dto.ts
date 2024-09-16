import { Category } from 'src/categories/entities/category.entity';
import { Product } from '../entities/product.entity';

export class ProductPublicDTO {
  name: string;
  price: number;
  description: string;
  image?: string;
  stock: number;
  category?: Category;

  static fromSchema(product: Product): ProductPublicDTO {
    return {
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image,
      stock: product.stock,
      category: product.category,
    };
  }

  static fromSchemaWithOutCategory(
    product: ProductPublicDTO,
  ): ProductPublicDTO {
    return {
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image,
      stock: product.stock,
    };
  }
}
