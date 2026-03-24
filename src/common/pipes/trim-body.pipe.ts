import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TrimBodyPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body' || !value || typeof value !== 'object') {
      return value;
    }

    return this.trimObjectStrings(value);
  }

  private trimObjectStrings(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map((item) => this.trimObjectStrings(item));
    }

    if (obj !== null && typeof obj === 'object') {
      const trimmedObj: Record<string, any> = {};
      for (const key of Object.keys(obj)) {
        trimmedObj[key] = this.trimObjectStrings(obj[key]);
      }
      return trimmedObj;
    }

    if (typeof obj === 'string') {
      return obj.trim();
    }

    return obj;
  }
}
