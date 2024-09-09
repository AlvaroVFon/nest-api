import { ProductDto } from './product.dto';
import { ProductPublicDTO } from './product.public.dto';

//DUDA: Es correcto crear dos interfaces? O solo debería ser una para respuestas públicas?
export interface ProductPublicResponseDto {
  data: ProductPublicDTO[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ProductResponseDto {
  data: ProductDto[];
  total: number;
  page: number;
  totalPages: number;
}
