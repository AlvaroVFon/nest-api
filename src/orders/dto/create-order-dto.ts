import {
  IsNotEmpty,
  IsNumber,
  IsArray,
  ArrayNotEmpty,
} from '@nestjs/class-validator';

export class CreateOrderItemDto {
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

export class CreateOrderDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  items: CreateOrderItemDto[];
}
