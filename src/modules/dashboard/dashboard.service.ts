import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Project, ProjectDocument } from '../projects/schemas/project.schema';
import { Blog, BlogDocument } from '../blogs/schemas/blog.schema';
import {
  ContactMessage,
  ContactMessageDocument,
} from '../contact/schemas/contact-message.schema';
import {
  Newsletter,
  NewsletterDocument,
} from '../newsletter/schemas/newsletter.schema';
import { Skill, SkillDocument } from '../skills/schemas/skill.schema';
import {
  Experience,
  ExperienceDocument,
} from '../experience/schemas/experience.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>,
    @InjectModel(Blog.name)
    private readonly blogModel: Model<BlogDocument>,
    @InjectModel(ContactMessage.name)
    private readonly contactModel: Model<ContactMessageDocument>,
    @InjectModel(Newsletter.name)
    private readonly newsletterModel: Model<NewsletterDocument>,
    @InjectModel(Skill.name)
    private readonly skillModel: Model<SkillDocument>,
    @InjectModel(Experience.name)
    private readonly experienceModel: Model<ExperienceDocument>,
  ) {}

  async getStats() {
    const [
      totalProjects,
      totalPublishedProjects,
      totalBlogs,
      totalPublishedBlogs,
      totalMessages,
      unreadMessages,
      totalSubscribers,
      totalSkills,
      totalExperience,
    ] = await Promise.all([
      this.projectModel.countDocuments(),
      this.projectModel.countDocuments({ isPublished: true }),
      this.blogModel.countDocuments(),
      this.blogModel.countDocuments({ isPublished: true }),
      this.contactModel.countDocuments(),
      this.contactModel.countDocuments({ isRead: false }),
      this.newsletterModel.countDocuments(),
      this.skillModel.countDocuments(),
      this.experienceModel.countDocuments(),
    ]);

    return {
      message: 'Dashboard data fetched successfully',
      data: {
        totalProjects,
        totalPublishedProjects,
        totalBlogs,
        totalPublishedBlogs,
        totalMessages,
        unreadMessages,
        totalSubscribers,
        totalSkills,
        totalExperience,
      },
    };
  }
}