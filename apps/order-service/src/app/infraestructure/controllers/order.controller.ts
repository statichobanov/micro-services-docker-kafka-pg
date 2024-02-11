import { Controller, Inject, Logger, OnModuleInit } from '@nestjs/common';

import { ClientKafka, MessagePattern, EventPattern, Payload } from '@nestjs/microservices';
import { CreateOrder } from '../../aplication/createOrder.service';
import { UpdateOrder } from '../../aplication/updateOrder.service';

@Controller()
export class OrderController implements OnModuleInit {
  constructor(
    @Inject(`KAFKA_CLIENT`) private readonly kafkaClient: ClientKafka,
    @Inject(CreateOrder) private createOrder: CreateOrder,
    @Inject(UpdateOrder) private updateOrder: UpdateOrder
  ) {}

  @MessagePattern('order-events')
  handleCreateOrder(@Payload() message) {
    Logger.log('Message', { message });
    switch (message.type) {
      case 'create-order':
        return this.createOrder.run(message);
    }
  }

  @EventPattern('product-events')
  handleUpdateOrder(@Payload() message) {
    Logger.log('Event', { message });
    switch (message.type) {
      case 'product-updated':
        return this.updateOrder.run(message);
    }
  }

  onModuleInit() {
    this.kafkaClient.subscribeToResponseOf(`order-events`);
    this.kafkaClient.subscribeToResponseOf(`product-events`);
  }
}
