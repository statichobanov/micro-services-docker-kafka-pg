import { OrderIRepository } from '../domain/order.i.repository';

export class CreateOrder {
  constructor(private orderRepository: OrderIRepository) {}
  async run(order) {
    return this.orderRepository.createOrder(order);
  }
}
