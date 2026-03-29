import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from './base.service';
import { Menu } from '../entities/menu.entity';

@Injectable()
export class RolesService extends BaseService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(Menu)
    private readonly menuRepo: Repository<Menu>,
  ) {
    super();
  }

  async create(data: { name: string }) {
    try {
      const exist = await this.roleRepo.findOneBy({name:data.name})
      if (exist) {
        throw new BadRequestException(`role with name ${data.name} is already exist`)
      }
      const role = this.roleRepo.create(data);
      return await this.roleRepo.save(role);
    } catch (error) {
      this.handleError(error, 'Failed to create role');
    }
  }

  async findAll() {
    try {
      return await this.roleRepo.find();
    } catch (error) {
      this.handleError(error, 'Failed to fetch roles');
    }
  }

  async findOne(id: string) {
    try {
      return await this.roleRepo.findOne({ where: { id } });
    } catch (error) {
      this.handleError(error, `Failed to fetch role ${id}`);
    }
  }

  async update(id: string, data: Partial<Role>) {
    try {
      const currentRole = await this.roleRepo.findOneBy({id})
      const exist = await this.roleRepo.findOneBy({name:data.name})
      if (exist && currentRole && currentRole.name !== exist.name) {
        throw new BadRequestException(`role with name ${data.name} is already exist`)
      }

      await this.roleRepo.update(id, data);
      return this.findOne(id);
    } catch (error) {
      this.handleError(error, `Failed to update role ${id}`);
    }
  }

  async remove(id: string) {
    try {
      return await this.roleRepo.softDelete(id);
    } catch (error) {
      this.handleError(error, `Failed to delete role ${id}`);
    }
  }

  async updateAccess(roleId: string, menuIds: number[]) {
    try {
      const role = await this.roleRepo.findOne({
        where: { id: roleId },
        relations: ['menus'],
      });

      if (!role) throw new NotFoundException('Role not found');

      role.menus = await this.menuRepo.findBy({
        id: In(menuIds),
      });

      return await this.roleRepo.save(role);
    } catch (error) {
      this.handleError(error, `Failed to update access`);
    }
  }

  async getAccess(id: string) {
    try {
      const role = await this.roleRepo.findOne({
        where: { id },
        relations: ['menus'],
      });

      if (!role) throw new NotFoundException('Role not found');

      return {
        ...role,
        menuIds: role.menus.map(m => m.id),
      };
    } catch (error) {
      this.handleError(error, `Failed to get access for role ${id}`);
    }
  }
}