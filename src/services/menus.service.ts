import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Menu } from '../entities/menu.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from './base.service';
import { CreateMenuDto } from '../dto/menu.create.dto';
import { UpdateMenuDto } from '../dto/menu.update.dto';

export interface MenuNode {
  id: number;
  name: string;
  parentId: number | null;
  roles: string[];
  children: MenuNode[];
}

export interface MenuResponse {
  id: number;
  name: string;
  parentId: number | null;
  children: MenuResponse[];
}

@Injectable()
export class MenusService extends BaseService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepo: Repository<Menu>,
  ) {
    super();
  }

  async create(data: CreateMenuDto) {
    const menu = this.menuRepo.create({
      name: data.name,
      path: data.path,
    });

    if (data.parentId) {
      const parent = await this.menuRepo.findOneBy({ id: data.parentId });
      if (parent) menu.parent = parent;
    }

    return await this.menuRepo.save(menu);
  }

  async update(id: number, data: UpdateMenuDto) {
    try {
      const menu = await this.menuRepo.findOne({
        where: { id },
        relations: ['parent']
      });

      if (!menu) throw new NotFoundException('Menu tidak ditemukan');

      if (data.name) menu.name = data.name;
      if (data.path) menu.path = data.path;

      if (data.parentId !== undefined) {
        if (data.parentId === null) {
          menu.parent = null;
        } else {
          if (data.parentId === id) {
            throw new BadRequestException('Menu tidak bisa menjadi parent untuk dirinya sendiri');
          }

          const parent = await this.menuRepo.findOne({ where: { id: data.parentId } });
          if (!parent) throw new NotFoundException('Parent menu baru tidak ditemukan');
          menu.parent = parent;
        }
      }

      return await this.menuRepo.save(menu);
    } catch (error) {
      this.handleError(error, `Gagal update menu ${id}`);
    }
  }

  async findOne(id: number) {
    try {
      return await this.menuRepo.findOne({
        where: { id },
        relations: ['children', 'roles'],
      });
    } catch (error) {
      this.handleError(error, `Failed to fetch menu ${id}`);
    }
  }

  async remove(id: number) {
    try {
      return await this.menuRepo.softDelete(id);
    } catch (error) {
      this.handleError(error, `Failed to delete menu ${id}`);
    }
  }

  async getMenuByRole(roleName: string) {
    try {
      const menusWithAccess = await this.menuRepo.find({
        where: {
          roles: { name: roleName }
        },
        relations: ['parent'],
        withDeleted: false,
      });

      const allowedMenuIds = new Set(menusWithAccess.map(m => m.id));

      const allMenus = await this.menuRepo.find({
        relations: ['parent'],
        order: { id: 'ASC' }
      });

      const buildMenuTree = (parentId: number | null): any[] => {
        return allMenus
          .filter(m => (m.parent ? m.parent.id : null) === parentId)
          .map(m => {
            const hasAccess = allowedMenuIds.has(m.id);

            const children = buildMenuTree(m.id);

            if (hasAccess || children.length > 0) {
              return {
                id: m.id,
                name: m.name,
                path: m.path,
                children: children.length > 0 ? children : null
              };
            }
            return null;
          })
          .filter(node => node !== null);
      };

      return buildMenuTree(null);

    } catch (error) {
      this.handleError(error, "Gagal ambil menu");
    }
  }

  async findAllTree() {
    try {
      const menus = await this.menuRepo.find({
        relations: ['parent'],
        withDeleted: false,
        order: { id: 'ASC' }
      });

      const menuMap: Record<number, any> = {};
      menus.forEach(menu => {
        menuMap[menu.id] = {
          id: menu.id,
          name: menu.name,
          path: menu.path,
          parentId: menu.parent ? menu.parent.id : null,
          children: [],
        };
      });

      const tree: any[] = [];
      menus.forEach(menu => {
        const node = menuMap[menu.id];
        if (node.parentId && menuMap[node.parentId]) {
          menuMap[node.parentId].children.push(node);
        } else {
          tree.push(node);
        }
      });

      return tree;
    } catch (error) {
      this.handleError(error, 'Failed to fetch menu tree');
    }
  }
}