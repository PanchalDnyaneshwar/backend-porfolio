import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppModule } from '../app.module';
import { Settings } from '../modules/settings/schemas/settings.schema';

export const runSeed = async () => {
  const app = await NestFactory.createApplicationContext(AppModule);
  const settingsModel = app.get<Model<Settings>>(getModelToken(Settings.name));

  const existing = await settingsModel.findOne().lean().exec();
  if (existing) {
    console.log('Settings already exist');
    await app.close();
    return;
  }

  await settingsModel.create({
    siteTitle: 'Portfolio by Dnyaneshwar',
    siteDescription:
      'Full stack developer portfolio featuring projects, blogs, and experience.',
    logo: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6',
    favicon: 'https://images.unsplash.com/photo-1529336953121-ad3c6e5c3533',
    primaryColor: '#38BDF8',
    seo: {
      metaTitle: 'Dnyaneshwar Panchal | Portfolio',
      metaDescription:
        'Discover projects, blogs, and experience in full stack development.',
      metaKeywords: 'portfolio, full stack, developer, react, nestjs',
    },
    contactInfo: {
      email: 'panchaldnyaneshwar.m@gmail.com',
      phone: '+91 90000 00000',
      location: 'Pune, India',
    },
  });

  console.log('Settings seeded successfully');
  await app.close();
};

if (process.argv[1]?.includes('settings.seed')) {
  runSeed();
}
