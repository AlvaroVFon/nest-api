import { Category } from '../entities/category.entity';
import { CategoryPublicDto } from './category.public.dto';

export class CategoryResponse {
  status: number;
  message: string;
  data: CategoryPublicDto[];
  total?: number;
  page?: number;
  totalPages?: number;

  static toPublic(category: CategoryResponse): CategoryResponse {
    return {
      status: category.status,
      message: category.message,
      data: category.data.map((category: Category) =>
        CategoryPublicDto.toObject(category),
      ),
      total: category.total,
      page: category.page,
      totalPages: category.totalPages,
    };
  }
}
