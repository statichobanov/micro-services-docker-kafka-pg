import { Product } from '@ecommerce/models';
import { ProductCatalogIRepository } from '../domain/productCatalog.i.repository';

export class GetProductCatalog {
  constructor(private productCatalogRepository: ProductCatalogIRepository) {}
  async run(): Promise<Product[]> {
    return await this.productCatalogRepository.getProductCatalog();
  }
}
