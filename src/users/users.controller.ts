import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from 'src/pagination/pagination.dto';
import { UserResponse } from './dto/user.response.dto';
import { UserPublicDto } from './dto/user.public.dto';
import { UserDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserPublicDto> {
    const response = await this.usersService.create(createUserDto);

    if (response instanceof HttpException) {
      throw response;
    }
    return UserDto.fromSchematoPublic(response);
  }

  // DUDA: cómo manejar errores. Cómo saber que errores puede lanzar el servicio

  @Get()
  async findAll(@Query() paginationDto: PaginationDto): Promise<UserResponse> {
    const response = await this.usersService.findAll(paginationDto);

    if (response instanceof HttpException) {
      throw response;
    }

    return UserResponse.toPublic(response);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserPublicDto> {
    const user = await this.usersService.findOne(+id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return UserDto.fromSchematoPublic(user);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const response = await this.usersService.update(+id, updateUserDto);

    if (response instanceof HttpException) {
      throw response;
    }

    return response;
  }

  @Delete(':id')
  async softDelete(@Param('id') id: string): Promise<UserResponse> {
    const response = await this.usersService.remove(+id);

    if (response instanceof HttpException) {
      throw response;
    }

    return UserResponse.toPublic(response);
  }

  @Patch(':id/restore')
  async restore(@Param('id') id: string) {
    const response = await this.usersService.restore(+id);

    if (response instanceof HttpException) {
      throw response;
    }

    return response;
  }
}
