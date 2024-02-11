import { ProductModel } from '../domain/models/product.model';
import { ApiGatewayIRepository } from '../domain/apiGateway.i.repository';

export class UpdateProduct {
  constructor(private apiGatewayRepository: ApiGatewayIRepository) {}
  async run(product: ProductModel) {
    return this.apiGatewayRepository.updateProduct(product);
  }
}
