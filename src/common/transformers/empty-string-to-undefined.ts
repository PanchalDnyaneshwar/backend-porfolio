import { TransformFnParams } from 'class-transformer';

/**
 * `@IsOptional()` does not skip empty strings (`""`).
 * This converts `""` -> `undefined` so optional URL validators pass.
 */
export function emptyStringToUndefined({ value }: TransformFnParams) {
  if (typeof value === 'string' && value.trim() === '') {
    return undefined;
  }

  return value;
}

