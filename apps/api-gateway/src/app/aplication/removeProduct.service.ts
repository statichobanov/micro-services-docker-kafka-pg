import { ApiGatewayIRepository } from '../domain/apiGateway.i.repository';

export class RemoveProduct {
  constructor(private apiGatewayRepository: ApiGatewayIRepository) {}
  async run(id: string) {
    return this.apiGatewayRepository.removeProduct(id);
  }
}
