import { ProductCatalogIRepository } from '../domain/productCatalog.i.repository';

export class GetProductCatalog {
  constructor(private productCatalogRepository: ProductCatalogIRepository) {}
  async run() {
    return this.productCatalogRepository.getProductCatalog();
  }
}
