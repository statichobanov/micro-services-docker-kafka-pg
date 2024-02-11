import { OrderIRepository } from '../domain/order.i.repository';
import { Product } from '@ecommerce/models';

export class UpdateOrder {
  constructor(private orderRepository: OrderIRepository) {}
  async run(product: Product) {
    return this.orderRepository.updateOrder(product);
  }
}
