import { ProductModel } from '@ecommerce/models';
import { ApiGatewayIRepository } from '../domain/apiGateway.i.repository';

export class GetProductCatalog {
  constructor(private apiGatewayRepository: ApiGatewayIRepository) {}
  async run(): Promise<ProductModel[]> {
    return await this.apiGatewayRepository.getProductCatalog();
  }
}
