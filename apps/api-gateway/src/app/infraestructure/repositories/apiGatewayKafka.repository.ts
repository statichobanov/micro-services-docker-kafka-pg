import { Inject, OnModuleInit } from '@nestjs/common';
import { ApiGatewayIRepository } from '../../domain/apiGateway.i.repository';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

export class ApiGatewayKafkaRepository
  implements ApiGatewayIRepository, OnModuleInit
{
  constructor(
    @Inject(`KAFKA_CLIENT`)
    private readonly kafkaClient: ClientKafka
  ) {}
  async getProductCatalog() {
    return await lastValueFrom(
      this.kafkaClient.send('product-events', 'getList')
    );
  }

  async authenticate(user) {
    return await lastValueFrom(this.kafkaClient.send('user-events', user));
  }

  async createOrder(order) {
    return await lastValueFrom(this.kafkaClient.send('order-events', order));
  }

  onModuleInit() {
    this.kafkaClient.subscribeToResponseOf(`product-events`);
    this.kafkaClient.subscribeToResponseOf(`user-events`);
    this.kafkaClient.subscribeToResponseOf(`order-events`);
  }
}
