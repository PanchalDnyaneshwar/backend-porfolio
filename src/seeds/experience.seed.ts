import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppModule } from '../app.module';
import { Experience } from '../modules/experience/schemas/experience.schema';

export const runSeed = async () => {
  const app = await NestFactory.createApplicationContext(AppModule);
  const experienceModel = app.get<Model<Experience>>(
    getModelToken(Experience.name),
  );

  const count = await experienceModel.countDocuments();
  if (count > 0) {
    console.log('Experience entries already exist');
    await app.close();
    return;
  }

  await experienceModel.insertMany([
    {
      companyName: 'Acme Digital',
      role: 'Frontend Engineer',
      startDate: new Date('2022-04-01'),
      endDate: new Date('2023-09-01'),
      currentlyWorking: false,
      description:
        'Built modern UI systems and led feature rollouts for customer dashboards.',
      technologies: ['React', 'TypeScript', 'TailwindCSS'],
      sortOrder: 1,
      isActive: true,
    },
    {
      companyName: 'Nova Labs',
      role: 'Full Stack Developer',
      startDate: new Date('2023-10-01'),
      currentlyWorking: true,
      description:
        'Owning backend APIs and admin dashboards for SaaS products.',
      technologies: ['NestJS', 'MongoDB', 'React'],
      sortOrder: 2,
      isActive: true,
    },
  ]);

  console.log('Experience seeded successfully');
  await app.close();
};

if (process.argv[1]?.includes('experience.seed')) {
  runSeed();
}
