import { IsNotEmpty, IsNumber } from '@nestjs/class-validator';
export class UpdateCartItemDto {
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
