import { User } from '../entities/user.entity';

export class UserDto {
  id: number;
  name: string;
  email: string;
  password: string;
  role_id: number;
  created_at: Date;
  updated_at?: Date;
  deleted_at?: Date;

  static fromSchema(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      role_id: user.role_id,
      created_at: user.created_at,
      updated_at: user.updated_at,
      deleted_at: user.deleted_at,
    };
  }
}
