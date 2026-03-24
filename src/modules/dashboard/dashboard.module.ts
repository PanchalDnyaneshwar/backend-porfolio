import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

import { Project, ProjectSchema } from '../projects/schemas/project.schema';
import { Blog, BlogSchema } from '../blogs/schemas/blog.schema';
import {
  ContactMessage,
  ContactMessageSchema,
} from '../contact/schemas/contact-message.schema';
import {
  Newsletter,
  NewsletterSchema,
} from '../newsletter/schemas/newsletter.schema';
import { Skill, SkillSchema } from '../skills/schemas/skill.schema';
import {
  Experience,
  ExperienceSchema,
} from '../experience/schemas/experience.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      { name: Blog.name, schema: BlogSchema },
      { name: ContactMessage.name, schema: ContactMessageSchema },
      { name: Newsletter.name, schema: NewsletterSchema },
      { name: Skill.name, schema: SkillSchema },
      { name: Experience.name, schema: ExperienceSchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
