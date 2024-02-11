import { ApiGatewayIRepository } from '../domain/apiGateway.i.repository';

export class GetProduct {
  constructor(private apiGatewayRepository: ApiGatewayIRepository) {}
  async run(id: string) {
    return this.apiGatewayRepository.getProduct(id);
  }
}
