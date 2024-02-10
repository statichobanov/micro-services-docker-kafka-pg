import { Controller, Inject, Logger, OnModuleInit } from '@nestjs/common';

import { ClientKafka, EventPattern, Payload } from '@nestjs/microservices';
import { CreateOrder } from '../../aplication/createOrder.service';

@Controller()
export class OrderController implements OnModuleInit {
  constructor(
    @Inject(`KAFKA_CLIENT`) private readonly kafkaClient: ClientKafka,
    @Inject(CreateOrder) private createOrder: CreateOrder
  ) {}

  @EventPattern('order-events')
  handleCreateOrder(@Payload() message) {
    Logger.log({ message });
    this.createOrder.run(message);
  }

  onModuleInit() {
    this.kafkaClient.subscribeToResponseOf(`order-events`);
  }
}
