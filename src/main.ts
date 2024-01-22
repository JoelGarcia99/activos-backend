import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { API_PORT } from './environment/variables';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
  });

  app.useGlobalPipes(
    new ValidationPipe(
      {
        // throw an exception if the field in DTO is not in whitelist
        forbidNonWhitelisted: true,
        // Also, throw an exception if a field in the body is not part of the DTO
        whitelist: true,
      }
    )
  );

  app.setGlobalPrefix('api');
  await app.listen(API_PORT);
}

bootstrap();
