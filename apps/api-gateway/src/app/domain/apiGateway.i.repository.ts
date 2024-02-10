export interface ApiGatewayIRepository {
  getProductCatalog();
  authenticate(user);
  createOrder(order);
}
