import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProjectDocument = HydratedDocument<Project>;

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  slug: string;

  @Prop({ required: true, trim: true })
  shortDescription: string;

  @Prop()
  fullDescription?: string;

  @Prop()
  thumbnail?: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: [String], default: [] })
  techStack: string[];

  @Prop({ trim: true })
  category?: string;

  @Prop()
  liveUrl?: string;

  @Prop()
  githubUrl?: string;

  @Prop({ default: false })
  featured: boolean;

  @Prop({ default: 0 })
  sortOrder: number;

  @Prop({ default: true })
  isPublished: boolean;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);

ProjectSchema.index({ isPublished: 1, featured: 1, category: 1 });