import { Product } from '@ecommerce/models';
import { ProductCatalogIRepository } from '../domain/productCatalog.i.repository';

export class CreateProduct {
  constructor(private productCatalogRepository: ProductCatalogIRepository) {}
  async run(product: Product): Promise<Product> {
    return await this.productCatalogRepository.createProduct(product);
  }
}
