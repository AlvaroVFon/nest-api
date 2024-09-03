import { IsString } from '@nestjs/class-validator';
export class CreateRoleDto {
  @IsString({ message: 'Role name must be a string' })
  name: string;
  created_at: Date;
}
