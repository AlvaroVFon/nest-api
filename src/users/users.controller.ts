import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
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
    const user = await this.usersService.create(createUserDto);

    return UserDto.fromSchematoPublic(user);
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto): Promise<UserResponse> {
    const response = await this.usersService.findAll(paginationDto);

    return UserResponse.toPublic(response);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserPublicDto> {
    const user = await this.usersService.findOne(+id);

    return UserDto.fromSchematoPublic(user);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserPublicDto> {
    const user = await this.usersService.update(+id, updateUserDto);

    return UserDto.fromSchematoPublic(user);
  }

  @Delete(':id')
  async softDelete(@Param('id') id: string): Promise<UserPublicDto> {
    const user = await this.usersService.remove(+id);

    return UserDto.fromSchematoPublic(user);
  }

  @Patch(':id/restore')
  async restore(@Param('id') id: string): Promise<UserPublicDto> {
    const user = await this.usersService.restore(+id);

    return UserDto.fromSchematoPublic(user);
  }
}
