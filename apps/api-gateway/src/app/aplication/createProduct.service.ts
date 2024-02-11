import { ApiGatewayIRepository } from '../domain/apiGateway.i.repository';
import { ProductModel } from '../domain/models/product.model';

export class CreateProduct {
  constructor(private apiGatewayRepository: ApiGatewayIRepository) {}
  async run(product: ProductModel) {
    return this.apiGatewayRepository.createProduct(product);
  }
}
