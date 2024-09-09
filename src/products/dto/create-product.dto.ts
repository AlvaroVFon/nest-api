export class CreateProductDto {
  name: string;
  price: number;
  description: string;
  image?: string;
  stock: number;
  categoryId: number;
  createdAt: Date;
}
