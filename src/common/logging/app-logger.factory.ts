import { ConsoleLogger, LoggerService } from '@nestjs/common';
import { JsonProductionLogger } from './json-logger.service';

export function createBootstrapLogger(): LoggerService {
  if (process.env.NODE_ENV === 'production') {
    return new JsonProductionLogger();
  }
  return new ConsoleLogger();
}
