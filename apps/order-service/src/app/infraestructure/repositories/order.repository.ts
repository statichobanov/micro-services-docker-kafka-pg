import { Inject, Logger } from '@nestjs/common';
import { OrderIRepository } from '../../domain/order.i.repository';
import { ClientKafka } from '@nestjs/microservices';
import { Order, Product } from '@ecommerce/models';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorHandler } from '@ecommerce/error';

export class OrderRepository implements OrderIRepository {
  constructor(
    @Inject(`KAFKA_CLIENT`) private readonly kafkaClient: ClientKafka,
    @InjectRepository(Order) private orderRepository: Repository<Order>
  ) {}

  /**
   * Creates a new order and emits an event to Kafka.
   * @param order The order entity to be saved.
   * @returns The saved order entity.
   */
  async createOrder(order: Order): Promise<Order> {
    try {
      const result = await this.orderRepository.save(order);
      const message = JSON.stringify({
        type: 'order-created',
        data: result,
      });
      this.kafkaClient.emit('order-events', message);
      return result;
    } catch (error) {
      ErrorHandler.handleError(error.message, error.errorCode, 'OrderRepository.createOrder()');
    }
  }

  /**
   * Updates an order based on the provided product details. (Method placeholder)
   * @param product Optional product entity to update the order with.
   */
  async updateOrder(product?: Product): Promise<void> {
    Logger.log('Update order', { product });
    // Implementation for updating an order goes here.
    // This method is currently a placeholder and needs to be implemented.
  }
}
