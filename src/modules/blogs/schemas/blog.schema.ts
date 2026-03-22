import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BlogDocument = HydratedDocument<Blog>;

@Schema({ timestamps: true })
export class Blog {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  slug: string;

  @Prop({ required: true, trim: true })
  excerpt: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  featuredImage?: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop()
  category?: string;

  @Prop({ default: false })
  isPublished: boolean;

  @Prop()
  publishedAt?: Date;

  @Prop({ default: 1 })
  readTime: number;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

BlogSchema.index({ isPublished: 1, category: 1, publishedAt: -1 });