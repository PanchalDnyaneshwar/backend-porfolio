import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EmailLogDocument = HydratedDocument<EmailLog>;

export type EmailStatus = 'SENT' | 'FAILED';

@Schema({ timestamps: true })
export class EmailLog {
  @Prop({ required: true, trim: true })
  to: string;

  @Prop({ required: true, trim: true })
  subject: string;

  @Prop({ required: true })
  message: string;

  @Prop()
  html?: string;

  @Prop({ required: true, enum: ['SENT', 'FAILED'] })
  status: EmailStatus;

  @Prop()
  error?: string;
}

export const EmailLogSchema = SchemaFactory.createForClass(EmailLog);

EmailLogSchema.index({ createdAt: -1, status: 1 });
