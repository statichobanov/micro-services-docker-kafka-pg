import { Inject } from '@nestjs/common';
import { OrderIRepository } from '../../domain/order.i.repository';
import { ClientKafka } from '@nestjs/microservices';

export class OrderRepository implements OrderIRepository {
  constructor(
    @Inject(`KAFKA_CLIENT`)
    private readonly kafkaClient: ClientKafka
  ) {}

  createOrder(order) {
    this.kafkaClient.emit('order-events', JSON.stringify(order));
    return order;
  }
}
