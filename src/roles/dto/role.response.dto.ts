import { Role } from '../entities/role.entity';
import { RolePublicDto } from './public.role.dto';

export class RoleResponse {
  status: number;
  message: string;
  data?: RolePublicDto[];

  static toPublic(roleResponse: RoleResponse): RoleResponse {
    return {
      status: roleResponse.status,
      message: roleResponse.message,
      data: roleResponse.data.map((role: Role) =>
        RolePublicDto.fromEntity(role),
      ),
    };
  }
}
