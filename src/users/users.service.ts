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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });

      if (user) {
        throw new BadRequestException('User already exists');
      }

      createUserDto.password = await bcrypt.hashSync(
        createUserDto.password,
        10,
      );
      return await this.userRepository.save(createUserDto);
    } catch (error) {
      return error;
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

      // DUDA: por qué no me lanza error si data no es PublicUserDto[]???
      return {
        status: HttpStatus.OK,
        message: 'Users retrieved successfully',
        data: users,
        total,
        page,
        totalPages,
      };
    } catch (error) {
      return error;
    }
  }

  async findOne(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });

      return user;
    } catch (error) {
      return error;
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOne({ where: { email } });
    } catch (error) {
      return error;
    }
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponse> {
    try {
      const userEmail = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });

      if (userEmail && userEmail.id !== id) {
        throw new BadRequestException('User email already exists');
      }

      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      updateUserDto.updated_at = new Date();

      await this.userRepository.update(id, updateUserDto);

      return {
        status: HttpStatus.OK,
        message: 'User updated  successfully',
        data: [updateUserDto],
      };
    } catch (error) {
      return error;
    }
  }

  async remove(id: number): Promise<UserResponse> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      await this.userRepository.softDelete(id);

      return {
        status: HttpStatus.OK,
        message: 'User deleted successfully',
        data: [user],
      };
    } catch (error) {
      return error;
    }
  }
  async restore(id: number) {
    try {
      const user = await this.userRepository.findOne({
        where: { id, deleted_at: Not(IsNull()) },
        withDeleted: true,
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      await this.userRepository.restore(id);

      return {
        statusCode: HttpStatus.OK,
        message: 'User restored successfully',
      };
    } catch (error) {
      return error;
    }
  }
}
