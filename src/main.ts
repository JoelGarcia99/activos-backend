import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggerMiddleware } from './utils/logger';
import { EnvValue } from './environment/variables';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  app.use(new LoggerMiddleware().use);

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
  await app.listen(EnvValue.API_PORT);
}

bootstrap();
