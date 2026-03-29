import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { JwtAuthGuard } from '../auth/jwt.auth-guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/jwt.role-guard';
import { AssignRoleDto } from '../dto/user.assign-role';
import { UpdateUserDto } from '../dto/user.update';
import { CreateUserDto } from '../dto/user.create';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @UseGuards(RolesGuard)
  @Roles('admin')
  @Post()
  create(
    @Body() body: CreateUserDto,
  ) {
    return this.usersService.create(body);
  }
  
  @UseGuards(RolesGuard)
  @Roles('admin')
  @Post('assign-role')
  assignRole(
    @Body() body: AssignRoleDto,
  ) {
    return this.usersService.assignRole(body.userId, body.roleIds);
  }
  
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
  
  @UseGuards(RolesGuard)
  @Roles('admin')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
  ) {
    return this.usersService.update(id, body);
  }
  
  @UseGuards(RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}