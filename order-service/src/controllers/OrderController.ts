import { Request, Response } from "express";
import KafkaProducer from "../services/KafkaProducer";
import OrderInteractor from "../interactors/OrderInteractor";
import { OrderPayload } from "../entities/OrderPayload";
import OrderEntity from "../entities/OrderEntity";
import OrderProductsEntity from "../entities/OrderProductsEntity";
import { OrderStatusPayload } from "../entities/OrderStatusPayload";

class OrderController {
  private kafkaProducer: KafkaProducer;
  private orderInteractor: OrderInteractor;

  constructor(kafkaProducer: KafkaProducer, orederInteractor: OrderInteractor) {
    this.kafkaProducer = kafkaProducer;
    this.orderInteractor = orederInteractor;
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const orderPayload = req.body as OrderPayload;

      const newOrder: OrderEntity = await this.orderInteractor.create(
        orderPayload
      );

      // When a new order is created the products quantity should be removed
      this.kafkaProducer.sendMessage(
        "product-quantity-remove",
        JSON.stringify(newOrder.order_products)
      );

      res.status(200).json({ newOrder });
    } catch (error: any) {
      console.log("Error:", error);

      if (error.code == "23503") {
        res.status(500).json({ message: "User does not exists" });
      }

      res.status(500).json({ message: "Internal server error" });
    }
  }

  async updateStatus(req: Request, res: Response): Promise<void> {
    try {
      const orderStatusPayload = req.body as OrderStatusPayload;

      await this.orderInteractor.updateStatus(orderStatusPayload);

      res.status(200).json({ message: "Success" });
    } catch (error) {
      console.log("error: ", error);

      res.status(500).json({ message: "Internal server error" });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id_order } = req.body;

      const deletedProducts: OrderProductsEntity[] =
        await this.orderInteractor.delete(id_order);

      // When an order is deleted the products quantity should be returned (added) back
      this.kafkaProducer.sendMessage(
        "product-quantity-add",
        JSON.stringify(deletedProducts)
      );

      res.status(200).json({ message: "Success" });
    } catch (error) {
      console.log("Error:", error);

      res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default OrderController;
