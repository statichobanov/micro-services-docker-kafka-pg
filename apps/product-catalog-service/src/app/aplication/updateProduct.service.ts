import { Product } from '@ecommerce/models';
import { ProductCatalogIRepository } from '../domain/productCatalog.i.repository';

export class UpdateProduct {
  constructor(private productCatalogRepository: ProductCatalogIRepository) {}
  async run(product: Product): Promise<{ result: string }> {
    return await this.productCatalogRepository.updateProduct(product);
  }
}
