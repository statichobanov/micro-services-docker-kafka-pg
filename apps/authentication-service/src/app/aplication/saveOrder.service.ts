import { Order } from '@ecommerce/models';
import { AuthenticationIRepository } from '../domain/authentication.i.repository';

export class SaveOrder {
  constructor(private authenticationRepository: AuthenticationIRepository) {}
  async run(order: Order): Promise<void> {
    return await this.authenticationRepository.saveOrder(order);
  }
}
