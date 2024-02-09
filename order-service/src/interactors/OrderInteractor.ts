import OrderEntity from "../entities/OrderEntity";
import { OrderPayload } from "../entities/OrderPayload";
import OrderProductsEntity from "../entities/OrderProductsEntity";
import { OrderStatusPayload } from "../entities/OrderStatusPayload";
import OrderRepository from "../repositories/OrderRepository";

class OrderInteractor {
  private orderRepository: OrderRepository;

  constructor() {
    this.orderRepository = new OrderRepository();
  }

  async create(orderPayload: OrderPayload): Promise<OrderEntity> {
    return await this.orderRepository.createOrder(orderPayload);
  }

  async updateStatus(orderStatusPayload: OrderStatusPayload): Promise<void> {
    await this.orderRepository.updateStatusOrder(orderStatusPayload);
  }

  async delete(id_order: string): Promise<OrderProductsEntity[]> {
    return await this.orderRepository.deleteOrder(id_order);
  }
}

export default OrderInteractor;
