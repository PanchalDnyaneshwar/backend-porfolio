import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AbstractHttpAdapter } from '@nestjs/core/adapters/http-adapter';
import type { RequestHandler } from 'express';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { createBootstrapLogger } from './common/logging/app-logger.factory';
import { TrimBodyPipe } from './common/pipes/trim-body.pipe';
import { setupSwagger } from './docs/swagger';

/** Normalize to browser Origin form: scheme + host (no path, no trailing slash). */
function normalizeWebOrigin(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  try {
    const u = new URL(trimmed);
    return `${u.protocol}//${u.host}`;
  } catch {
    return null;
  }
}

function buildAllowedOriginSet(
  frontendUrl: string | undefined,
  adminUrl: string | undefined,
  additionalCsv: string | undefined,
): Set<string> {
  const set = new Set<string>();
  for (const url of [frontendUrl, adminUrl]) {
    const n = url ? normalizeWebOrigin(url) : null;
    if (n) set.add(n);
  }
  if (additionalCsv) {
    for (const part of additionalCsv.split(',')) {
      const n = normalizeWebOrigin(part);
      if (n) set.add(n);
    }
  }
  return set;
}

export async function createApp(httpAdapter?: AbstractHttpAdapter) {
  const logger = createBootstrapLogger();
  const app = httpAdapter
    ? await NestFactory.create(AppModule, httpAdapter, {
        logger,
        bufferLogs: true,
      })
    : await NestFactory.create(AppModule, { logger, bufferLogs: true });

  configureApp(app);

  await app.init();

  return app;
}

export function configureApp(app: INestApplication) {
  const configService = app.get(ConfigService);
  const nodeEnv = configService.get<string>('nodeEnv') ?? 'development';
  const expressApp = app.getHttpAdapter().getInstance() as {
    disable: (setting: string) => void;
    set: (setting: string, value: unknown) => void;
    use: (handler: RequestHandler) => void;
  };

  expressApp.set('trust proxy', 1);
  expressApp.disable('x-powered-by');

  expressApp.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    }),
  );

  const frontendUrl = configService.get<string>('frontendUrl');
  const adminUrl = configService.get<string>('adminUrl');
  const additionalCorsOrigins = configService.get<string>('additionalCorsOrigins');
  const allowedOriginSet = buildAllowedOriginSet(
    frontendUrl,
    adminUrl,
    additionalCorsOrigins,
  );

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      const normalized = normalizeWebOrigin(origin);
      if (normalized && allowedOriginSet.has(normalized)) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    credentials: true,
  });

  app.useGlobalPipes(new TrimBodyPipe());

  if (nodeEnv !== 'production') {
    setupSwagger(app);
  }
}
