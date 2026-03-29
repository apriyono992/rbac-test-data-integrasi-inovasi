import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { RolesService } from '../services/roles.service';
import { JwtAuthGuard } from '../auth/jwt.auth-guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/jwt.role-guard';

@UseGuards(JwtAuthGuard,RolesGuard)
@Roles('admin')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() body: { name: string }) {
    return this.rolesService.create(body);
  }

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @Get('detail/:id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Patch('update/:id')
  update(@Param('id') id: string, @Body() body: Partial<{ name: string }>) {
    return this.rolesService.update(id, body);
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Patch('update-access/:id')
  updateAccess(@Param('id') roleId: string,@Body('menuIds') menuIds:number[]) {
    return this.rolesService.updateAccess(roleId, menuIds);
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Get('access/:id')
  getAccess(@Param('id') id: string) {
    return this.rolesService.getAccess(id);
  }
}