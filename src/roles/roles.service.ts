import {
  Injectable,
  BadRequestException,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { Repository, Not, IsNull } from 'typeorm';
import { RoleResponse } from './dto/role.response.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}
  async create(createRoleDto: CreateRoleDto): Promise<RoleResponse> {
    try {
      createRoleDto.created_at = new Date();

      const roleName = await this.roleRepository.findOne({
        where: { name: createRoleDto.name },
      });

      if (roleName) {
        throw new BadRequestException('Role name already exists');
      }

      const createdUser = await this.roleRepository.save(createRoleDto);

      return {
        status: HttpStatus.CREATED,
        message: 'Role created',
        data: [createdUser],
      };
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<RoleResponse> {
    try {
      const roles = await this.roleRepository.find();

      if (!roles) {
        throw new BadRequestException('No roles found');
      }

      return {
        status: HttpStatus.OK,
        message: 'Roles found',
        data: roles,
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number): Promise<Role> {
    try {
      return await this.roleRepository.findOne({ where: { id } });
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: number,
    updateRoleDto: UpdateRoleDto,
  ): Promise<RoleResponse> {
    try {
      const roleName = await this.roleRepository.findOne({
        where: { name: updateRoleDto.name },
      });

      if (roleName && roleName.id !== id) {
        throw new BadRequestException('Role name already exists');
      }

      const role = await this.roleRepository.findOne({ where: { id } });

      if (!role) {
        throw new NotFoundException('Role not found');
      }

      updateRoleDto.updated_at = new Date();

      await this.roleRepository.update(id, updateRoleDto);
      return {
        status: HttpStatus.OK,
        message: 'Role updated',
        data: [await this.roleRepository.findOne({ where: { id } })],
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number): Promise<RoleResponse> {
    try {
      const role = await this.roleRepository.findOne({
        where: { id },
      });

      if (!role) {
        throw new NotFoundException('Role not found');
      }

      await this.roleRepository.softDelete(id);

      return {
        status: HttpStatus.OK,
        message: 'Role deleted',
        data: [role],
      };
    } catch (error) {
      throw error;
    }
  }

  async restore(id: number): Promise<RoleResponse> {
    try {
      const role = await this.roleRepository.findOne({
        where: { id, deleted_at: Not(IsNull()) },
        withDeleted: true,
      });

      if (!role) {
        throw new NotFoundException('Role not found');
      }

      await this.roleRepository.restore(id);

      return {
        status: HttpStatus.OK,
        message: 'Role restored',
        data: [role],
      };
    } catch (error) {
      throw error;
    }
  }
}
