import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppModule } from '../app.module';
import { Skill } from '../modules/skills/schemas/skill.schema';
import { SkillCategory } from '../modules/skills/dto/create-skill.dto';

export const runSeed = async () => {
  const app = await NestFactory.createApplicationContext(AppModule);
  const skillModel = app.get<Model<Skill>>(getModelToken(Skill.name));

  const count = await skillModel.countDocuments();
  if (count > 0) {
    console.log('Skills already exist');
    await app.close();
    return;
  }

  await skillModel.insertMany([
    {
      name: 'TypeScript',
      category: SkillCategory.LANGUAGES,
      level: 'Advanced',
      sortOrder: 1,
      isActive: true,
    },
    {
      name: 'React',
      category: SkillCategory.FRONTEND,
      level: 'Advanced',
      sortOrder: 2,
      isActive: true,
    },
    {
      name: 'Node.js',
      category: SkillCategory.BACKEND,
      level: 'Advanced',
      sortOrder: 3,
      isActive: true,
    },
    {
      name: 'NestJS',
      category: SkillCategory.BACKEND,
      level: 'Intermediate',
      sortOrder: 4,
      isActive: true,
    },
    {
      name: 'MongoDB',
      category: SkillCategory.DATABASES,
      level: 'Intermediate',
      sortOrder: 5,
      isActive: true,
    },
  ]);

  console.log('Skills seeded successfully');
  await app.close();
};

if (process.argv[1]?.includes('skills.seed')) {
  runSeed();
}
