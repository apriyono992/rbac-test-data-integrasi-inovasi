import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Req, Query } from '@nestjs/common';
import { MenusService } from '../services/menus.service';
import { JwtAuthGuard } from '../auth/jwt.auth-guard';
import { Roles } from '../auth/roles.decorator';
import { Menu } from '../entities/menu.entity';
import { RolesGuard } from '../auth/jwt.role-guard';
import { CreateMenuDto } from '../dto/menu.create.dto';
import { UpdateMenuDto } from '../dto/menu.update.dto';

@UseGuards(JwtAuthGuard)
@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Get('my-menu')
  async getMyMenu(@Req() req: any) {
    return this.menusService.getMenuByRole(req.user.role);
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Get('tree')
  async getFullTree() {
    return this.menusService.findAllTree();
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Post()
  async create(@Body() body: CreateMenuDto) {
    return this.menusService.create(body);
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateMenuDto) {
    return this.menusService.update(+id, body);
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.menusService.remove(+id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.menusService.findOne(+id);
  }
}