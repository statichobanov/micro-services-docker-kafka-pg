import { ProductModel } from '@ecommerce/models';
import { ApiGatewayIRepository } from '../domain/apiGateway.i.repository';

export class GetProduct {
  constructor(private apiGatewayRepository: ApiGatewayIRepository) {}
  async run(id: string): Promise<ProductModel> {
    return await this.apiGatewayRepository.getProduct(id);
  }
}
