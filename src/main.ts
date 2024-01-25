import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggerMiddleware } from './utils/logger';
import { EnvValue } from './environment/variables';
import { schema as envSchema } from './environment/initialization';
import 'dotenv/config'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import helmet from '@fastify/helmet';

async function bootstrap() {

  // validating environment schema
  const result = envSchema.validate({
    ...process.env
  }, { allowUnknown: true });

  if (result.error) {
    throw new Error(result.error.message);
  }

  // Initializing env variables with new values
  EnvValue.init(result.value);

  // Using fastify as the defailt HTTP engine instead of Express for better performance
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true })
  );

  app.use(new LoggerMiddleware().use);

  // Protect app headers against common known vulnerabilities
  await app.register(helmet);

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
  await app.listen(EnvValue.API_PORT, '0.0.0.0');
}

bootstrap();
