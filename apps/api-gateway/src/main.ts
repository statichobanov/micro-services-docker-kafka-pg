import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { ApiGatewayModule } from './app/infraestructure/controllers/apiGateway.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const globalPrefix = 'api';
  const app = await NestFactory.create(ApiGatewayModule);
  const config = new DocumentBuilder()
    .setTitle('Api Gateway')
    .setDescription('Ecommerce Api Gateway')
    .setVersion('1.0')
    .build();
  app.setGlobalPrefix(globalPrefix);
  const document = SwaggerModule.createDocument(app, config);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'api-gateway',
        brokers: ['kafka:9092'],
      },
      consumer: {
        groupId: 'api-gateway-consumer',
      },
    },
  });
  await app.startAllMicroservices();

  app.setGlobalPrefix(globalPrefix);

  SwaggerModule.setup(`${globalPrefix}/docs`, app, document);

  const port = process.env.PORT || 3003;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
  Logger.log(`Swagger is running on: http://localhost:${port}/api/docs`);
}

bootstrap();
