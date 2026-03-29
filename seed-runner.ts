import { AppDataSource } from './data-source';
import { seed } from './src/seed/seed';
import { seedMenus } from './src/seed/menu-seed';
import { seedUserWithRoles } from './src/seed/user-with-role-seed';

AppDataSource.initialize().then(async () => {
  await seed(AppDataSource);
  await seedMenus(AppDataSource);
  await seedUserWithRoles(AppDataSource);
  process.exit(0);
});