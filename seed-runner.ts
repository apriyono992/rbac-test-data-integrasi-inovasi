import { AppDataSource } from './data-source';
import { seed } from './src/seed/seed';
import { seedMenus } from './src/seed/menu-seed';

AppDataSource.initialize().then(async () => {
  await seed(AppDataSource);
  await seedMenus(AppDataSource);
  process.exit(0);
});