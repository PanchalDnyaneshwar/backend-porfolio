import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppModule } from '../app.module';
import { Profile } from '../modules/profile/schemas/profile.schema';

export const runSeed = async () => {
  const app = await NestFactory.createApplicationContext(AppModule);
  const profileModel = app.get<Model<Profile>>(getModelToken(Profile.name));

  const existing = await profileModel.findOne().lean().exec();
  if (existing) {
    console.log('Profile already exists');
    await app.close();
    return;
  }

  await profileModel.create({
    fullName: 'Dnyaneshwar Panchal',
    title: 'Full Stack Developer',
    shortBio: 'Crafting modern web experiences with clean, scalable code.',
    longBio:
      'I build performant web products with thoughtful UX and reliable backend systems. I enjoy owning features end-to-end and partnering with teams to ship great experiences.',
    email: 'panchaldnyaneshwar.m@gmail.com',
    phone: '+91 90000 00000',
    location: 'Pune, India',
    profileImage:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
    resumeUrl: 'https://example.com/resume.pdf',
    socialLinks: {
      github: 'https://github.com/your-handle',
      linkedin: 'https://www.linkedin.com/in/your-handle',
      twitter: 'https://twitter.com/your-handle',
      portfolio: 'https://yourdomain.com',
    },
  });

  console.log('Profile seeded successfully');
  await app.close();
};

if (process.argv[1]?.includes('profile.seed')) {
  runSeed();
}
