import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { SkillCategory } from '../dto/create-skill.dto';

export type SkillDocument = HydratedDocument<Skill>;

@Schema({ timestamps: true })
export class Skill {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(SkillCategory),
  })
  category: SkillCategory;

  @Prop({ trim: true })
  level?: string;

  @Prop()
  icon?: string;

  @Prop({ default: 0 })
  sortOrder: number;

  @Prop({ default: true })
  isActive: boolean;
}

export const SkillSchema = SchemaFactory.createForClass(Skill);

SkillSchema.index({ category: 1, isActive: 1, sortOrder: 1 });
