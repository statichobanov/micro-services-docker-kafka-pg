import { ApiGatewayIRepository } from '../domain/apiGateway.i.repository';

export class GetProductCatalog {
  constructor(private apiGatewayRepository: ApiGatewayIRepository) {}
  async run() {
    return this.apiGatewayRepository.getProductCatalog();
  }
}
