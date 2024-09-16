import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleResponse } from './dto/role.response.dto';
import { RolePublicDto } from './dto/public.role.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto): Promise<RoleResponse> {
    const response = await this.rolesService.create(createRoleDto);

    return RoleResponse.toPublic(response);
  }

  @Get()
  async findAll(): Promise<RoleResponse> {
    const response = await this.rolesService.findAll();

    return RoleResponse.toPublic(response);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<RolePublicDto> {
    const user = await this.rolesService.findOne(+id);

    return RolePublicDto.fromEntity(user);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<RoleResponse> {
    const response = await this.rolesService.update(+id, updateRoleDto);

    return RoleResponse.toPublic(response);
  }

  @Patch(':id/restore')
  async restore(@Param('id') id: string) {
    const response = await this.rolesService.restore(+id);

    return RoleResponse.toPublic(response);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<RoleResponse> {
    const response = await this.rolesService.remove(+id);

    return RoleResponse.toPublic(response);
  }
}
