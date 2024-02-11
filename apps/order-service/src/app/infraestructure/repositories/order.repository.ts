import { Inject, Logger } from '@nestjs/common';
import { OrderIRepository } from '../../domain/order.i.repository';
import { ClientKafka } from '@nestjs/microservices';
import { Order, Product } from '@ecommerce/models';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class OrderRepository implements OrderIRepository {
  constructor(
    @Inject(`KAFKA_CLIENT`) private readonly kafkaClient: ClientKafka,
    @InjectRepository(Order) private orderRepository: Repository<Order>
  ) {}

  async createOrder(order: Order) {
    const result = await this.orderRepository.save(order);
    const message = JSON.stringify({
      type: 'order-created',
      data: result,
    });
    this.kafkaClient.emit('order-events', message);
    return result;
  }

  async updateOrder(product: Product) {
    Logger.log('Update order', { product });
    const orders = await this.orderRepository
      .createQueryBuilder('order')
      .innerJoinAndSelect('order.products', 'product', 'product.id = :productId', { productId: product.id })
      .getMany();
    Logger.log('Orders to update', { orders });
    const ordersToUpdate = [];
    for (const order of orders) {
      ordersToUpdate.push(this.orderRepository.update(order.id, order));
    }
    await Promise.all(ordersToUpdate);
  }
}
