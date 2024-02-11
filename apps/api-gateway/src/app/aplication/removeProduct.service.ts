import { ProductModel } from '../domain/models/product.model';
import { ApiGatewayIRepository } from '../domain/apiGateway.i.repository';

export class RemoveProduct {
  constructor(private apiGatewayRepository: ApiGatewayIRepository) {}
  async run(product: ProductModel) {
    return this.apiGatewayRepository.removeProduct(product);
  }
}
