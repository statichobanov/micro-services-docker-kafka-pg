import { ProductModel } from './models/product.model';

export interface ApiGatewayIRepository {
  getProductCatalog();
  getProduct(id: string);
  createProduct(product: ProductModel);
  updateProduct(product: ProductModel);
  removeProduct(product: ProductModel);
  authenticate(user);
  createOrder(order);
}
