import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SettingsDocument = HydratedDocument<Settings>;

@Schema({ _id: false })
class SeoSettings {
  @Prop()
  metaTitle?: string;

  @Prop()
  metaDescription?: string;

  @Prop()
  metaKeywords?: string;
}

@Schema({ _id: false })
class ContactInfo {
  @Prop()
  email?: string;

  @Prop()
  phone?: string;

  @Prop()
  location?: string;

  @Prop()
  mapUrl?: string;
}

@Schema({ timestamps: true })
export class Settings {
  @Prop()
  siteTitle?: string;

  @Prop()
  siteDescription?: string;

  @Prop()
  logo?: string;

  @Prop()
  favicon?: string;

  @Prop()
  primaryColor?: string;

  @Prop({ type: SeoSettings, default: {} })
  seo?: SeoSettings;

  @Prop({ type: ContactInfo, default: {} })
  contactInfo?: ContactInfo;
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);
