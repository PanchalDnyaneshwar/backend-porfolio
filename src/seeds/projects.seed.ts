import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppModule } from '../app.module';
import { Project } from '../modules/projects/schemas/project.schema';

export const runSeed = async () => {
  const app = await NestFactory.createApplicationContext(AppModule);
  const projectModel = app.get<Model<Project>>(getModelToken(Project.name));

  const count = await projectModel.countDocuments();
  if (count > 0) {
    console.log('Projects already exist');
    await app.close();
    return;
  }

  await projectModel.insertMany([
    {
      title: 'Portfolio CMS',
      slug: 'portfolio-cms',
      shortDescription:
        'Admin dashboard to manage portfolio content with full CRUD workflows.',
      fullDescription:
        'A full-stack portfolio CMS featuring authentication, rich content editing, and analytics.',
      thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
      images: [
        'https://images.unsplash.com/photo-1521737604893-d14cc237f11d',
        'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7',
      ],
      techStack: ['React', 'NestJS', 'MongoDB', 'TailwindCSS'],
      category: 'Web App',
      liveUrl: 'https://example.com/portfolio-cms',
      githubUrl: 'https://github.com/your-handle/portfolio-cms',
      featured: true,
      sortOrder: 1,
      isPublished: true,
    },
    {
      title: 'Project Atlas',
      slug: 'project-atlas',
      shortDescription:
        'Productivity platform for managing distributed teams and tasks.',
      fullDescription:
        'A SaaS platform with team workspaces, analytics, and integrations.',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
      images: ['https://images.unsplash.com/photo-1504384308090-c894fdcc538d'],
      techStack: ['TypeScript', 'React', 'Node.js'],
      category: 'SaaS',
      liveUrl: 'https://example.com/project-atlas',
      githubUrl: 'https://github.com/your-handle/project-atlas',
      featured: false,
      sortOrder: 2,
      isPublished: true,
    },
  ]);

  console.log('Projects seeded successfully');
  await app.close();
};

if (process.argv[1]?.includes('projects.seed')) {
  runSeed();
}
