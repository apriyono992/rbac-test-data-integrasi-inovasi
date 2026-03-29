// src/seed/menu.seed.ts
import { DataSource } from 'typeorm';
import { Menu } from '../entities/menu.entity';

export async function seedMenus(dataSource: DataSource) {
  const menuRepo = dataSource.getRepository(Menu);

  // helper biar ga duplicate
  const createMenu = async (
    name: string,
    path: string,
    parent: Menu | null = null,
  ) => {
    let existing = await menuRepo.findOne({ where: { path } });
    if (existing) return existing;

    const menu = menuRepo.create({
      name,
      path,
      parent,
    });

    return await menuRepo.save(menu);
  };

  // ===== MENU 1 =====
  const m1 = await createMenu('Menu 1', '1');

  const m11 = await createMenu('Menu 1.1', '1.1', m1);
  const m12 = await createMenu('Menu 1.2', '1.2', m1);

  const m121 = await createMenu('Menu 1.2.1', '1.2.1', m12);
  const m122 = await createMenu('Menu 1.2.2', '1.2.2', m12);

  const m13 = await createMenu('Menu 1.3', '1.3', m1);
  const m131 = await createMenu('Menu 1.3.1', '1.3.1', m13);

  // ===== MENU 2 =====
  const m2 = await createMenu('Menu 2', '2');

  const m21 = await createMenu('Menu 2.1', '2.1', m2);
  const m22 = await createMenu('Menu 2.2', '2.2', m2);

  const m221 = await createMenu('Menu 2.2.1', '2.2.1', m22);
  const m222 = await createMenu('Menu 2.2.2', '2.2.2', m22);

  const m2221 = await createMenu('Menu 2.2.2.1', '2.2.2.1', m222);
  const m2222 = await createMenu('Menu 2.2.2.2', '2.2.2.2', m222);

  const m223 = await createMenu('Menu 2.2.3', '2.2.3', m22);

  const m23 = await createMenu('Menu 2.3', '2.3', m2);

  // ===== MENU 3 =====
  const m3 = await createMenu('Menu 3', '3');

  const m31 = await createMenu('Menu 3.1', '3.1', m3);
  const m32 = await createMenu('Menu 3.2', '3.2', m3);

  console.log('✅ Menu seed selesai');
}