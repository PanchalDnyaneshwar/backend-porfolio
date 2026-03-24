import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProfileDocument = HydratedDocument<Profile>;

@Schema({ _id: false })
class SocialLinks {
  @Prop()
  github?: string;

  @Prop()
  linkedin?: string;

  @Prop()
  twitter?: string;

  @Prop()
  portfolio?: string;
}

@Schema({ timestamps: true })
export class Profile {
  @Prop({ required: true, trim: true })
  fullName: string;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ trim: true })
  shortBio?: string;

  @Prop()
  longBio?: string;

  @Prop({ required: true, trim: true, lowercase: true })
  email: string;

  @Prop({ trim: true })
  phone?: string;

  @Prop({ trim: true })
  location?: string;

  @Prop()
  profileImage?: string;

  @Prop()
  resumeUrl?: string;

  @Prop({ type: SocialLinks, default: {} })
  socialLinks?: SocialLinks;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
