import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}
  async create(createRoleDto: CreateRoleDto) {
    try {
      createRoleDto.created_at = new Date();
      const createdUser = await this.roleRepository.save(createRoleDto);

      if (createdUser) {
        return {
          statusCode: HttpStatus.CREATED,
          message: 'Role created successfully',
          data: createdUser,
        };
      }

      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Role not created',
      };
    } catch (error) {
      console.log(error);
    }
  }

  async findAll() {
    try {
      const roles = await this.roleRepository.find();

      if (!roles) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'No roles found',
        };
      }
      return roles;
    } catch (error) {
      console.log(error);
    }
  }

  async findOne(id: number) {
    try {
      const role = await this.roleRepository.findOne({ where: { id } });
      if (!role) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Role not found',
        };
      }

      return role;
    } catch (error) {
      console.log(error);
    }
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    try {
      const role = await this.roleRepository.findOne({ where: { id } });

      if (!role) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Role not found',
        };
      }

      updateRoleDto.updated_at = new Date();
      const updatedRole = await this.roleRepository.update(id, updateRoleDto);

      if (updatedRole.affected > 0) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Role updated successfully',
        };
      }
    } catch (error) {
      console.log(error);
    }
  }

  async softRemove(id: number) {
    try {
      const role = await this.roleRepository.findOne({ where: { id } });

      if (!role) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Role not found',
        };
      }

      const deletedRole = await this.roleRepository.softDelete(id);

      if (deletedRole.affected > 0) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Role deleted successfully',
        };
      }
    } catch (error) {
      console.log(error);
    }
  }
}
