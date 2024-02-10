/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AuthenticationModule } from './app/infraestructure/controllers/authentication.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthenticationModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'authentication-service',
          brokers: ['kafka:9092'],
        },
        consumer: {
          groupId: 'authentication-service-consumer',
        },
      },
    }
  );
  await app.listen();
  Logger.log(`🚀 Authentication Service is running`);
}

bootstrap();
