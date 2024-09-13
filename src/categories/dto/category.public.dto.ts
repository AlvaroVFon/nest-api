import { CategoryDto } from './category.dto';

export class CategoryPublicDto {
  id: number;
  name: string;
  description: string;

  static toObject(category: CategoryDto): CategoryPublicDto {
    return {
      id: category.id,
      name: category.name,
      description: category.description,
    };
  }
}
