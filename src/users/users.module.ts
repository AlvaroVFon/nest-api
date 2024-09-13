import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { RolesModule } from 'src/roles/roles.module';
import { RolesService } from 'src/roles/roles.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule, RolesModule],
  controllers: [UsersController],
  providers: [UsersService, RolesService],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
