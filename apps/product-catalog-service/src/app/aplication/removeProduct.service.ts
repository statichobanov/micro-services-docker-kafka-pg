import { ProductCatalogIRepository } from '../domain/productCatalog.i.repository';

export class RemoveProduct {
  constructor(private productCatalogRepository: ProductCatalogIRepository) {}
  async run(id: string) {
    return this.productCatalogRepository.removeProduct(id);
  }
}
