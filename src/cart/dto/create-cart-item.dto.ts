import { IsNumber, IsNotEmpty } from '@nestjs/class-validator';

export class CreateCartItemDto {
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
