import {
  Entity,
  Column,
  ManyToMany,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Menu } from './menu.entity';

@Entity('roles')
export class Role extends BaseEntity {
  @Column({ unique: true, length: 50 })
  name: string;

  @ManyToMany(() => User, user => user.roles)
  users: User[];

  @ManyToMany(() => Menu, menu => menu.roles)
  menus: Menu[];
}