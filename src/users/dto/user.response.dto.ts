import { User } from '../entities/user.entity';
import { UserDto } from './user.dto';
import { UserPublicDto } from './user.public.dto';

export class UserResponse {
  status: number;
  message: string;
  data?: UserPublicDto[];
  total?: number;
  page?: number;
  totalPages?: number;

  static toPublic(userResponse: UserResponse): UserResponse {
    return {
      status: userResponse.status,
      message: userResponse.message,
      data: userResponse.data.map((user: User) =>
        UserDto.fromSchematoPublic(user),
      ),
      total: userResponse.total,
      page: userResponse.page,
      totalPages: userResponse.totalPages,
    };
  }
}
