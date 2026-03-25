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
  const allowedOrigins = [frontendUrl, adminUrl].filter(Boolean) as string[];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
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
