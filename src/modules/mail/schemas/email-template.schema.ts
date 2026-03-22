import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EmailTemplateDocument = HydratedDocument<EmailTemplate>;

@Schema({ timestamps: true })
export class EmailTemplate {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  subject: string;

  @Prop({ required: true })
  html: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const EmailTemplateSchema = SchemaFactory.createForClass(EmailTemplate);

EmailTemplateSchema.index({ name: 1, isActive: 1 });
