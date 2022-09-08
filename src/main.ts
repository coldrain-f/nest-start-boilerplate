import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('SERVER_PORT');

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('title')
    .setDescription('description')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Global Pipe
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(PORT);
  Logger.log(`Application running on port ${PORT}, http://localhost:${PORT}`);
  Logger.log(`Go to API Docs : http://localhost:${PORT}/docs`);
}

bootstrap();
