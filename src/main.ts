import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { TrimBodyPipe } from './common/pipes/trim-body.pipe';
import { setupSwagger } from './docs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const frontendUrl = configService.get<string>('frontendUrl');
  const adminUrl = configService.get<string>('adminUrl');

  app.enableCors({
    origin: [frontendUrl!, adminUrl!],
    credentials: true,
  });

  app.useGlobalPipes(new TrimBodyPipe());

  setupSwagger(app);

  const port = configService.get<number>('port') || 5000;
  await app.listen(port);

  console.log(`Server running on http://localhost:${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/docs`);
}
bootstrap();
