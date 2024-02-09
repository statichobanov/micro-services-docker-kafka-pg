class OrderProductsEntity {
  id_order: string;
  id_product: string;
  quantity: number;

  constructor(id_order: string, id_product: string, quantity: number) {
    this.id_order = id_order;
    this.id_product = id_product;
    this.quantity = quantity;
  }
}

export default OrderProductsEntity;
