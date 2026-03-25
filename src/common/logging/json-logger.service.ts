import { LoggerService } from '@nestjs/common';

function writeLine(level: string, message: unknown, context?: string) {
  const payload = {
    level,
    message: typeof message === 'string' ? message : String(message),
    context,
    ts: new Date().toISOString(),
  };
  process.stdout.write(`${JSON.stringify(payload)}\n`);
}

export class JsonProductionLogger implements LoggerService {
  log(message: unknown, context?: string) {
    writeLine('info', message, context);
  }

  error(message: unknown, context?: string) {
    writeLine('error', message, context);
  }

  warn(message: unknown, context?: string) {
    writeLine('warn', message, context);
  }

  debug(message: unknown, context?: string) {
    writeLine('debug', message, context);
  }

  verbose(message: unknown, context?: string) {
    writeLine('verbose', message, context);
  }

  fatal(message: unknown, context?: string) {
    writeLine('fatal', message, context);
  }
}
