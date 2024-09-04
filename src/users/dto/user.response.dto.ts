import { UserDto } from './user.dto';
import { UserPublicDto } from './user.public.dto';

export class UserResponse {
  static toObject(user: UserDto): UserPublicDto {
    return {
      name: user.name,
      email: user.email,
    };
  }
}
