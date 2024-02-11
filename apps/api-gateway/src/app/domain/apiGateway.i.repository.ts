import { ProductModel } from './models/product.model';

export interface ApiGatewayIRepository {
  getProductCatalog();
  getProduct(id: string);
  createProduct(product: ProductModel);
  updateProduct(product: ProductModel);
  removeProduct(id: string);
  authenticate(user);
  createOrder(order);
}
