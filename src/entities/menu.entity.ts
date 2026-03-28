import {
  Entity,
  Column, ManyToOne, OneToMany, ManyToMany, JoinTable,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Role } from './role.entity';

@Entity('menus')
export class Menu extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  path: string;

  @ManyToOne(() => Menu, menu => menu.children, { nullable: true })
  parent: Menu;

  @OneToMany(() => Menu, menu => menu.parent)
  children: Menu[];

  @ManyToMany(() => Role, role => role.menus)
  @JoinTable({
    name: 'role_menus',
    joinColumn: { name: 'menu_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' }
  })
  roles: Role[];
}