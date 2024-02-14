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

  /**
   * Handles incoming messages for creating orders.
   * @param message The payload of the message received.
   */
  @MessagePattern('order-events')
  handleCreateOrder(@Payload() message) {
    Logger.log('Handling order creation message', { message });
    switch (message.type) {
      case 'create-order':
        return this.createOrder.run(message.data);
    }
  }

  /**
   * Handles incoming events for updating orders, triggered by product updates
   * @param message The payload of the event received.
   */
  @EventPattern('product-events')
  handleUpdateOrdeProducts(@Payload() message) {
    Logger.log('Handling order update event', { message });
    switch (message.type) {
      case 'product-updated':
        return this.updateOrder.run(message.data);
    }
  }

  /**
   * Handles incoming events for updating orders, triggered by user logins.
   * @param message The payload of the event received.
   */
  @EventPattern('user-events')
  handleUpdateOrderUser(@Payload() message) {
    Logger.log('Handling order update event', { message });
    switch (message.type) {
      case 'user-loged':
        return this.updateOrder.run(message.data);
    }
  }

  /**
   * Subscribes to Kafka topics on module initialization.
   */
  onModuleInit() {
    this.kafkaClient.subscribeToResponseOf('order-events');
    this.kafkaClient.subscribeToResponseOf('product-events');
    this.kafkaClient.subscribeToResponseOf('user-events');
  }
}
