import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { Menu } from '../entities/menu.entity';

export async function seedUserWithRoles(dataSource: DataSource) {

  const userRepo = dataSource.getRepository(User);
  const roleRepo = dataSource.getRepository(Role);
  const menuRepo = dataSource.getRepository(Menu);

  const getOrCreateRole = async (roleName: string) => {
    let role = await roleRepo.findOne({ where: { name: roleName }, relations: ['menus'] });
    if (!role) {
      role = roleRepo.create({ name: roleName });
      role = await roleRepo.save(role);
      console.log(`✅ Role ${roleName} dibuat`);
    }
    return role;
  };

  const managerRole = await getOrCreateRole('MANAGER');
  const userRole = await getOrCreateRole('USER');

  const menu1 = await menuRepo.findOne({ where: { path: '1' } });
  const menu2 = await menuRepo.findOne({ where: { path: '2' } });
  const menu3_1 = await menuRepo.findOne({ where: { path: '3.1' } });

  if (!menu1 || !menu2 || !menu3_1) {
    console.error('❌ Menu path 1,2 atau 3.1 belum ada, jalankan seed menu dulu!');
    process.exit(1);
  }

  managerRole.menus = [menu1, menu2];
  await roleRepo.save(managerRole);

  userRole.menus = [menu2, menu3_1];
  await roleRepo.save(userRole);

  let newUser = await userRepo.findOne({
    where: { username: 'john' },
    relations: ['roles'],
  });

  if (!newUser) {
    const hashedPassword = await bcrypt.hash('john123', 10);

    newUser = userRepo.create({
      username: 'john',
      password: hashedPassword,
      fullName: 'John Doe',
      roles: [managerRole, userRole],
    });

    await userRepo.save(newUser);
  }

  console.log('✅ Seeder selesai: user john punya 2 role + menu sudah granted');

  process.exit(0);
}