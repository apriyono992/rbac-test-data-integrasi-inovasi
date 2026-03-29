import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { BaseService } from './base.service';
import { UpdateUserDto } from '../dto/user.update';
import { CreateUserDto } from '../dto/user.create';

@Injectable()
export class UsersService extends BaseService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {
    super();
  }

  async create(data: CreateUserDto) {
    try {
      const exist = await this.userRepo.findOneBy({username:data.username})
      if (exist) {
        throw new BadRequestException(`user with username ${data.username} is already exist`)
      }
      const hashed = await bcrypt.hash(data.password, 10);
      const user = this.userRepo.create({ ...data, password: hashed });
      const res = await this.userRepo.save(user);
      return {
        id: res.id,
        name: res.fullName
      }
    } catch (error) {
      this.handleError(error, 'Failed to create user');
    }
  }

  async assignRole(userId: string, roleIds: string[]) {
    try {
      const user = await this.userRepo.findOne({
        where: { id: userId },
        relations: ['roles'],
      });
      if (!user) throw new Error('User not found');

      user.roles = await this.roleRepo.findByIds(roleIds);
      return await this.userRepo.save(user);
    } catch (error) {
      this.handleError(error, `Failed to assign roles to user ${userId}`);
    }
  }

  async findAll() {
    try {
      return await this.userRepo.find({select:['id','username','fullName'], relations: ['roles'] });
    } catch (error) {
      this.handleError(error, 'Failed to fetch users');
    }
  }

  async findOne(id: string) {
    try {
      return await this.userRepo.findOne({
        select:['id','username','fullName'],
        where: { id },
        relations: ['roles'],
      });
    } catch (error) {
      this.handleError(error, `Failed to fetch user ${id}`);
    }
  }

  async findByUsername(username: string) {
    try {
      return await this.userRepo.findOne({
        where: { username },
        relations: ['roles'],
      });
    } catch (error) {
      this.handleError(error, `Failed to fetch user ${username}`);
    }
  }

  async update(id: string, data: UpdateUserDto) {
    try {
      const current = await this.userRepo.findOneBy({id})
      const exist = await this.userRepo.findOneBy({username:data.username})
      if (exist && current && current.username !== exist.username) {
        throw new BadRequestException(`user with username ${data.username} is already exist`)
      }
      if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
      }
      await this.userRepo.update(id, data);
      return this.findOne(id);
    } catch (error) {
      this.handleError(error, `Failed to update user ${id}`);
    }
  }

  async remove(id: string) {
    try {
      return await this.userRepo.softDelete(id);
    } catch (error) {
      this.handleError(error, `Failed to delete user ${id}`);
    }
  }
}