import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppModule } from '../app.module';
import { Blog } from '../modules/blogs/schemas/blog.schema';

export const runSeed = async () => {
  const app = await NestFactory.createApplicationContext(AppModule);
  const blogModel = app.get<Model<Blog>>(getModelToken(Blog.name));

  const count = await blogModel.countDocuments();
  if (count > 0) {
    console.log('Blogs already exist');
    await app.close();
    return;
  }

  await blogModel.insertMany([
    {
      title: 'Designing Admin Panels that Scale',
      slug: 'designing-admin-panels-that-scale',
      excerpt:
        'Principles and UI patterns that keep admin dashboards tidy and productive.',
      content:
        '<p>Admin dashboards should balance clarity with power. Start with well-defined sections, actionable metrics, and predictable workflows.</p><p>Use cards for highlights, tables for management, and modals for focused edits.</p>',
      featuredImage:
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
      tags: ['admin', 'ui', 'ux'],
      category: 'Product',
      isPublished: true,
      publishedAt: new Date('2024-08-01'),
      readTime: 6,
    },
    {
      title: 'Building with NestJS + MongoDB',
      slug: 'building-with-nestjs-mongodb',
      excerpt:
        'A practical checklist for structuring scalable backend services.',
      content:
        '<p>NestJS offers a modular approach for building APIs. Combine it with Mongoose models, DTO validation, and consistent error handling.</p><p>Use a layered architecture with services and controllers to keep logic clean.</p>',
      featuredImage:
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
      tags: ['nestjs', 'backend', 'mongodb'],
      category: 'Engineering',
      isPublished: true,
      publishedAt: new Date('2024-10-15'),
      readTime: 8,
    },
  ]);

  console.log('Blogs seeded successfully');
  await app.close();
};

if (process.argv[1]?.includes('blogs.seed')) {
  runSeed();
}
