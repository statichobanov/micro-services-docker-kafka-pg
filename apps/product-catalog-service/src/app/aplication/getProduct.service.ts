import { ProductCatalogIRepository } from '../domain/productCatalog.i.repository';

export class GetProduct {
  constructor(private productCatalogRepository: ProductCatalogIRepository) {}
  async run(id: string) {
    return this.productCatalogRepository.getProduct(id);
  }
}
