import { ProductCatalogIRepository } from '../domain/productCatalog.i.repository';

export class RemoveProduct {
  constructor(private productCatalogRepository: ProductCatalogIRepository) {}
  async run(id: string): Promise<{ result: string }> {
    return await this.productCatalogRepository.removeProduct(id);
  }
}
