import { NestFactory } from '@nestjs/core';
import * as bcrypt from 'bcrypt';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppModule } from '../app.module';
import { AdminUser } from '../modules/admin-user/schemas/admin-user.schema';
import { Role } from '../common/enums/role.enum';

export const runSeed = async () => {
  const app = await NestFactory.createApplicationContext(AppModule);

  const adminUserModel = app.get<Model<AdminUser>>(
    getModelToken(AdminUser.name),
  );

  const email = 'panchaldnyaneshwar.m@gmail.com';
  const existingAdmin = await adminUserModel.findOne({ email });

  if (existingAdmin) {
    console.log('Admin already exists');
    await app.close();
    return;
  }

  const hashedPassword = await bcrypt.hash('DP@admininfo&77', 10);

  await adminUserModel.create({
    name: 'Super Admin',
    email,
    password: hashedPassword,
    role: Role.SUPER_ADMIN,
    isActive: true,
  });

  console.log('Admin user seeded successfully');
  await app.close();
};

if (process.argv[1]?.includes('admin.seed')) {
  runSeed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
