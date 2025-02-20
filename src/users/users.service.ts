import * as bcrypt from 'bcrypt';
import {
  Injectable,
  HttpStatus,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { PaginationDto } from 'src/pagination/pagination.dto';
import { UserResponse } from './dto/user.response.dto';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private roleService: RolesService,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });

      if (user) {
        throw new BadRequestException('User already exists');
      }
      const role = await this.roleService.findOne(createUserDto.role_id);

      if (!role) {
        throw new NotFoundException('Role not found');
      }

      createUserDto.password = await bcrypt.hashSync(
        createUserDto.password,
        10,
      );
      return await this.userRepository.save(createUserDto);
    } catch (error) {
      throw error;
    }
  }

  async findAll(pagination: PaginationDto): Promise<UserResponse> {
    const { page = 1, limit = 3 } = pagination;

    const skip = (page - 1) * limit;

    try {
      const [users, total] = await this.userRepository.findAndCount({
        relations: ['role_id'],
        skip,
        take: limit,
      });

      const totalPages = Math.ceil(total / limit);

      if (page > totalPages) {
        throw new NotFoundException('Page not found');
      }

      return {
        status: HttpStatus.OK,
        message: 'Users retrieved successfully',
        data: users,
        total,
        page,
        totalPages,
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['role_id', 'orders'],
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOne({ where: { email } });
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (user.email === updateUserDto.email && user.id !== id) {
        throw new BadRequestException('User email already exists');
      }

      updateUserDto.updated_at = new Date();

      await this.userRepository.update(id, updateUserDto);

      return await this.userRepository.findOne({ where: { id } });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      await this.userRepository.softDelete(id);

      return user;
    } catch (error) {
      throw error;
    }
  }

  async restore(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id, deleted_at: Not(IsNull()) },
        withDeleted: true,
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      await this.userRepository.restore(id);

      return user;
    } catch (error) {
      throw error;
    }
  }
}
