import { IsString, IsOptional, IsDate } from 'class-validator';
import { OrderStatus } from '../entities/order.entity';
export class UpdateOrderDto {
  @IsOptional()
  status?: OrderStatus;

  @IsOptional()
  @IsString()
  checkoutSessionId?: string;

  @IsOptional()
  @IsDate()
  payedAt?: Date;
}
