import { ProductModel, UserModel } from '@ecommerce/models';

export interface ApiGatewayIRepository {
  getProductCatalog();
  getProduct(id: string);
  createProduct(product: ProductModel);
  createUser(user: UserModel);
  updateProduct(product: ProductModel);
  removeProduct(id: string);
  authenticate(login);
  createOrder(order);
}
