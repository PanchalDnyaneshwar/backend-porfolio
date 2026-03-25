import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MediaDocument = HydratedDocument<Media>;

@Schema({ timestamps: true })
export class Media {
  @Prop({ required: true })
  url: string;

  @Prop()
  alt?: string;

  @Prop()
  type?: string;

  @Prop()
  publicId?: string;

  @Prop()
  fileName?: string;

  @Prop()
  format?: string;

  @Prop()
  bytes?: number;

  @Prop()
  resourceType?: string;
}

export const MediaSchema = SchemaFactory.createForClass(Media);
