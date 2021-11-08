import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  new ValidationPipe();

  const config = new DocumentBuilder()
    .setTitle('Challenge API')
    .setDescription('by Federico Montes de Oca with 💖')
    .setVersion('1.0')
    .addTag('User')
    .addTag('Authentication')
    .addTag('Apartment')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
