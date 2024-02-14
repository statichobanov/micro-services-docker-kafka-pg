import { OrderIRepository } from '../domain/order.i.repository';
import { Order } from '@ecommerce/models';

export class CreateOrder {
  constructor(private orderRepository: OrderIRepository) {}
  async run(order: Order): Promise<Order> {
    return await this.orderRepository.createOrder(order);
  }
}
