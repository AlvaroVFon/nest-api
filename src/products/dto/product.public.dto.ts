import { ProductDto } from './product.dto';

export class ProductPublicDTO {
  name: string;
  price: number;
  description: string;
  image?: string;
  stock: number;
  category: string;

  static toObject(product: ProductDto): ProductPublicDTO {
    return {
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image,
      stock: product.stock,
      category: product.category.name,
    };
  }
}
