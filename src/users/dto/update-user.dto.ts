import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  name: string;
  email: string;
  password: string;
  role_id: number;
  updated_at: Date;
  deleted_at: Date;
}
