import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppModule } from '../app.module';
import { Media } from '../modules/media/schemas/media.schema';

export const runSeed = async () => {
  const app = await NestFactory.createApplicationContext(AppModule);
  const mediaModel = app.get<Model<Media>>(getModelToken(Media.name));

  const count = await mediaModel.countDocuments();
  if (count > 0) {
    console.log('Media entries already exist');
    await app.close();
    return;
  }

  await mediaModel.insertMany([
    {
      url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
      alt: 'Developer workspace',
      type: 'image',
      publicId: 'seed-workspace',
    },
    {
      url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d',
      alt: 'Team collaboration',
      type: 'image',
      publicId: 'seed-team',
    },
  ]);

  console.log('Media seeded successfully');
  await app.close();
};

if (process.argv[1]?.includes('media.seed')) {
  runSeed();
}
