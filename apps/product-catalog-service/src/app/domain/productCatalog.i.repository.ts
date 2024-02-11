import { Product } from '@ecommerce/models';

export interface ProductCatalogIRepository {
  getProductCatalog();
  getProduct(id: string);
  createProduct(Product: Product);
  updateProduct(Product: Product);
  removeProduct(id: string);
}
