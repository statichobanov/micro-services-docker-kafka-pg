import { Module } from '@nestjs/common';

import { ApiGatewayController } from './apiGateway.controller';
import { CreateOrder } from '../../aplication/createOrder.service';
import { ApiGatewayIRepository } from '../../domain/apiGateway.i.repository';
import { ApiGatewayKafkaRepository } from '../repositories/apiGatewayKafka.repository';
import { Authenticate } from '../../aplication/authenticate.service';
import { GetProductCatalog } from '../../aplication/getProductCatalog.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
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
      },
    ]),
  ],
  controllers: [ApiGatewayController],
  providers: [
    ApiGatewayKafkaRepository,
    {
      provide: Authenticate,
      useFactory(apiGatewayRepository: ApiGatewayIRepository) {
        return new Authenticate(apiGatewayRepository);
      },
      inject: [ApiGatewayKafkaRepository],
    },
    {
      provide: CreateOrder,
      useFactory(apiGatewayRepository: ApiGatewayIRepository) {
        return new CreateOrder(apiGatewayRepository);
      },
      inject: [ApiGatewayKafkaRepository],
    },
    {
      provide: GetProductCatalog,
      useFactory(apiGatewayRepository: ApiGatewayIRepository) {
        return new GetProductCatalog(apiGatewayRepository);
      },
      inject: [ApiGatewayKafkaRepository],
    },
  ],
})
export class ApiGatewayModule {}
