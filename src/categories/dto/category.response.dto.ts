import { CategoryPublicDto } from './category.public.dto';

export class CategoryResponse {
  id: number;
  name: string;
  description: string;
  updated_at: Date;
  deleted_at: Date;

  static toObject(category: CategoryResponse): CategoryPublicDto {
    return {
      id: category.id,
      name: category.name,
      description: category.description,
    };
  }
}
