import { ApiGatewayIRepository } from '../domain/apiGateway.i.repository';

export class CreateOrder {
  constructor(private apiGatewayRepository: ApiGatewayIRepository) {}
  async run(order) {
    return this.apiGatewayRepository.createOrder(order);
  }
}
