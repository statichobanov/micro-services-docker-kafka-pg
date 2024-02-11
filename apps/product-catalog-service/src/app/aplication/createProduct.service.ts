import { Product } from '@ecommerce/models';
import { ProductCatalogIRepository } from '../domain/productCatalog.i.repository';

export class CreateProduct {
  constructor(private productCatalogRepository: ProductCatalogIRepository) {}
  async run(product: Product) {
    return this.productCatalogRepository.createProduct(product);
  }
}
