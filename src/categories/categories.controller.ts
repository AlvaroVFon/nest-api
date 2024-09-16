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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationDto } from 'src/pagination/pagination.dto';
import { CategoryResponse } from './dto/category.response.dto';
import { CategoryPublicDto } from './dto/category.public.dto';
import { CategoryDto } from './dto/category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryResponse> {
    const response = await this.categoriesService.create(createCategoryDto);

    return CategoryResponse.toPublic(response);
  }

  @Get()
  async findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<CategoryResponse> {
    const response = await this.categoriesService.findAll(paginationDto);

    return CategoryResponse.toPublic(response);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CategoryPublicDto> {
    const category = await this.categoriesService.findOne(+id);

    return CategoryDto.fromSchemaToPublic(category);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const response = await this.categoriesService.update(
      +id,
      updateCategoryDto,
    );

    return CategoryResponse.toPublic(response);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<CategoryResponse> {
    const response = await this.categoriesService.remove(+id);

    return CategoryResponse.toPublic(response);
  }

  @Patch(':id/restore')
  async restore(@Param('id') id: string) {
    const response = await this.categoriesService.restore(+id);

    return CategoryResponse.toPublic(response);
  }
}
