import { Role } from '../entities/role.entity';

export class RolePublicDto {
  id: number;
  name: string;

  static fromEntity(role: Role): RolePublicDto {
    return {
      id: role.id,
      name: role.name,
    };
  }
}
