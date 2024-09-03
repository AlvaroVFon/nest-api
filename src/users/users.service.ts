import * as bcrypt from 'bcrypt';
import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/pagination/pagination.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    createUserDto.password = await bcrypt.hashSync(createUserDto.password, 10);
    return this.userRepository.save(createUserDto);
  }

  async findAll(pagination: PaginationDto) {
    const { page = 1, limit = 3, skip } = pagination;

    const [users, total] = await this.userRepository.findAndCount({
      relations: ['role_id'],
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    const data = users.map(({ password, ...result }) => result); //eslint-disable-line

    return {
      data,
      total,
      page,
      totalPages,
    };
  }

  async findOne(id: number) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User not found',
        };
      }
      const { password, ...result } = user; //eslint-disable-line
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async findOneByEmail(email: string) {
    try {
      const user = this.userRepository.findOne({ where: { email } });
      if (!user) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User not found',
        };
      }
      return user;
    } catch (error) {
      console.log(error);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User not found',
        };
      }

      updateUserDto.updated_at = new Date();

      const updatedUser = await this.userRepository.update(id, updateUserDto);

      if (updatedUser.affected > 0) {
        return {
          statusCode: HttpStatus.OK,
          message: 'User updated successfully',
          data: updateUserDto,
        };
      }
    } catch (error) {
      console.log(error);
    }
  }

  async remove(id: number) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User not found',
        };
      }

      const deletedUser = await this.userRepository.delete(id);
      if (deletedUser.affected > 0) {
        return {
          statusCode: HttpStatus.OK,
          message: 'User deleted successfully',
        };
      }
    } catch (error) {
      console.log(error);
    }
  }

  async softRemove(id: number) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User not found',
        };
      }

      const updatedUser = await this.userRepository.softDelete(id);
      if (updatedUser.affected > 0) {
        return {
          statusCode: HttpStatus.OK,
          message: 'User deleted successfully',
        };
      }
    } catch (error) {
      console.log(error);
    }
  }
  async restore(id: number) {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        withDeleted: true,
      });

      if (!user) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User not found',
        };
      }

      const updatedUser = await this.userRepository.restore(id);
      if (updatedUser.affected > 0) {
        return {
          statusCode: HttpStatus.OK,
          message: 'User restored successfully',
        };
      }
    } catch (error) {
      console.log(error);
    }
  }
}
