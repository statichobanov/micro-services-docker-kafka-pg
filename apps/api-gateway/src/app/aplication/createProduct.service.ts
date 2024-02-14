import { ApiGatewayIRepository } from '../domain/apiGateway.i.repository';
import { ProductModel } from '@ecommerce/models';

export class CreateProduct {
  constructor(private apiGatewayRepository: ApiGatewayIRepository) {}
  async run(product: ProductModel): Promise<ProductModel> {
    return await this.apiGatewayRepository.createProduct(product);
  }
}
