import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ExperienceDocument = HydratedDocument<Experience>;

@Schema({ timestamps: true })
export class Experience {
  @Prop({ required: true, trim: true })
  companyName: string;

  @Prop({ required: true, trim: true })
  role: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop()
  endDate?: Date;

  @Prop({ default: false })
  currentlyWorking: boolean;

  @Prop()
  description?: string;

  @Prop({ type: [String], default: [] })
  technologies: string[];

  @Prop({ default: 0 })
  sortOrder: number;

  @Prop({ default: true })
  isActive: boolean;
}

export const ExperienceSchema = SchemaFactory.createForClass(Experience);

ExperienceSchema.index({ isActive: 1, sortOrder: 1, startDate: -1 });