import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

const FORBIDDEN_KEYS = ['_id', '__v', 'createdAt', 'updatedAt', 'id'];

/**
 * Defensive pipe for admin writes.
 * Admin forms may reset with raw Mongo documents (including metadata).
 * Since global `ValidationPipe` forbids non-whitelisted fields, we strip
 * forbidden keys from the incoming body to keep DTO validation strict.
 */
@Injectable()
export class StripMongoFieldsPipe implements PipeTransform {
  transform(value: unknown, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body' || !value || typeof value !== 'object') {
      return value;
    }

    const record = value as Record<string, unknown>;
    const copy: Record<string, unknown> = { ...record };

    for (const key of FORBIDDEN_KEYS) {
      if (key in copy) delete copy[key];
    }

    return copy;
  }
}

