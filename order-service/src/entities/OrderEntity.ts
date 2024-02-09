import OrderProductsEntity from "./OrderProductsEntity";

class OrderEntity {
  id: string;
  id_user: string;
  status: string;
  order_products: OrderProductsEntity[];

  constructor(
    id: string,
    status: string,
    userId: string,
    order_products: OrderProductsEntity[]
  ) {
    this.id = id;
    this.status = status;
    this.id_user = userId;

    this.order_products = order_products;
  }
}

export default OrderEntity;
