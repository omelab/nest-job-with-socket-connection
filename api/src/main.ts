import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Inside your bootstrap function
  app.useGlobalPipes(new ValidationPipe());

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Nest Bull API')
    .setDescription('API for managing nestjs bull que event')
    .setVersion('1.0')
    .addBearerAuth() // Add Bearer Auth
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // Get the ConfigService to access configuration
  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get<number>('app.port') || 3000; // Default to 3000 if not defined

  await app.listen(port);

  console.log(`http://localhost:${port}/api-docs`);
}
bootstrap();
