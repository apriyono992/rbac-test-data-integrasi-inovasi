import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';

export async function seed(dataSource: DataSource) {
  const userRepo = dataSource.getRepository(User);
  const roleRepo = dataSource.getRepository(Role);

  // cek role admin
  let adminRole = await roleRepo.findOne({ where: { name: 'admin' } });

  if (!adminRole) {
    adminRole = roleRepo.create({ name: 'admin' });
    await roleRepo.save(adminRole);
  }

  // cek user admin
  let adminUser = await userRepo.findOne({
    where: { username: 'admin' },
    relations: ['roles'],
  });

  if (!adminUser) {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    adminUser = userRepo.create({
      username: 'admin',
      password: hashedPassword,
      roles: [adminRole],
    });

    await userRepo.save(adminUser);
  }

  console.log('✅ Seeder selesai: admin user siap dipakai');
}