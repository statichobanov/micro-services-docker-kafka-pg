import { Product } from './models/product.entity';

export interface ProductCatalogIRepository {
  getProductCatalog();
  getProduct(id: string);
  createProduct(Product: Product);
  updateProduct(Product: Product);
  removeProduct(Product: Product);
}
