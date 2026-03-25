import { ConfigService } from '@nestjs/config';
import { createApp } from './app.factory';

async function bootstrap() {
  const app = await createApp();
  const configService = app.get(ConfigService);

  const port = configService.get<number>('port') || 5000;
  const nodeEnv = configService.get<string>('nodeEnv') ?? 'development';
  await app.listen(port);

  console.log(`Server running on http://localhost:${port}`);
  if (nodeEnv === 'production') {
    console.log('Swagger UI is disabled in production (NODE_ENV=production).');
  } else {
    console.log(`Swagger docs at http://localhost:${port}/api/docs`);
  }
}

bootstrap().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});
