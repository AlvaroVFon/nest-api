import { IsOptional, IsPositive } from '@nestjs/class-validator';
import { Type } from 'class-transformer';
export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  skip?: number;
}
