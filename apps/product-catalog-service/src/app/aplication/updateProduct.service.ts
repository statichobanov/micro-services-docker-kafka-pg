import { Product } from '../domain/models/product.entity';
import { ProductCatalogIRepository } from '../domain/productCatalog.i.repository';

export class UpdateProduct {
  constructor(private productCatalogRepository: ProductCatalogIRepository) {}
  async run(product: Product) {
    return this.productCatalogRepository.updateProduct(product);
  }
}
