import { Category } from 'src/categories/entities/category.entity';

export class ProductPublicDTO {
  name: string;
  price: number;
  description: string;
  image?: string;
  stock: number;
  category: Category;
}
