import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AbstractHttpAdapter } from '@nestjs/core/adapters/http-adapter';
import { AppModule } from './app.module';
import { TrimBodyPipe } from './common/pipes/trim-body.pipe';
import { setupSwagger } from './docs/swagger';

export async function createApp(httpAdapter?: AbstractHttpAdapter) {
  const app = httpAdapter
    ? await NestFactory.create(AppModule, httpAdapter)
    : await NestFactory.create(AppModule);

  configureApp(app);

  await app.init();

  return app;
}

export function configureApp(app: INestApplication) {
  const configService = app.get(ConfigService);

  app.getHttpAdapter().getInstance().disable('x-powered-by');

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

      return callback(new Error(`CORS blocked: ${origin}`), false);
    },
    credentials: true,
  });

  app.useGlobalPipes(new TrimBodyPipe());

  setupSwagger(app);
}
