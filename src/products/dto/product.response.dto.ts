import { Product } from '../entities/product.entity';
import { ProductDto } from './product.dto';
import { ProductPublicDTO } from './product.public.dto';

export class ProductResponseDto {
  status: number;
  message: string;
  data: ProductPublicDTO[];
  total?: number;
  page?: number;
  totalPages?: number;

  static toPublic(productResponse: ProductResponseDto): ProductResponseDto {
    return {
      status: productResponse.status,
      message: productResponse.message,
      data: productResponse.data.map((product: Product) =>
        ProductDto.fromSchemaToPublic(product),
      ),
      total: productResponse.total,
      page: productResponse.page,
      totalPages: productResponse.totalPages,
    };
  }
}
