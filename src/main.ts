import { ConfigService } from '@nestjs/config';
import { createApp } from './app.factory';

async function bootstrap() {
  const app = await createApp();
  const configService = app.get(ConfigService);

  const port = configService.get<number>('port') || 5000;
  await app.listen(port);

  console.log(`Server running on http://localhost:${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/docs`);
}
bootstrap();
