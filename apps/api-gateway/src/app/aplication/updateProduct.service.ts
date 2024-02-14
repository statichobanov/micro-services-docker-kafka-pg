import { ProductModel } from '@ecommerce/models';
import { ApiGatewayIRepository } from '../domain/apiGateway.i.repository';

export class UpdateProduct {
  constructor(private apiGatewayRepository: ApiGatewayIRepository) {}
  async run(product: ProductModel): Promise<{ result: string }> {
    return await this.apiGatewayRepository.updateProduct(product);
  }
}
