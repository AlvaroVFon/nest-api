import { Category } from '../entities/category.entity';

export class CategoryDto {
  id: number;
  name: string;
  description: string;
  updated_at: Date;
  deleted_at: Date;

  static fromSchema(category: Category) {
    return {
      id: category.id,
      name: category.name,
      description: category.description,
      updated_at: category.updated_at,
      deleted_at: category.deleted_at,
    };
  }
}
