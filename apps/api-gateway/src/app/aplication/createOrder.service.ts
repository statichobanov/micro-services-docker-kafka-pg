import { OrderModel } from '@ecommerce/models';
import { ApiGatewayIRepository } from '../domain/apiGateway.i.repository';

export class CreateOrder {
  constructor(private apiGatewayRepository: ApiGatewayIRepository) {}
  async run(order: OrderModel): Promise<OrderModel> {
    return await this.apiGatewayRepository.createOrder(order);
  }
}
