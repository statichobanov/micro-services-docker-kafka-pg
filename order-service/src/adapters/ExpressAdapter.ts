import express, { Express } from "express";

import KafkaProducer from "../services/KafkaProducer";
import OrderController from "../controllers/OrderController";
import OrderInteractor from "../interactors/OrderInteractor";

class ExpressAdapter {
  private orderController: OrderController;
  private orderInteractor: OrderInteractor;
  constructor(kafkaProducer: KafkaProducer) {
    this.orderInteractor = new OrderInteractor();
    this.orderController = new OrderController(
      kafkaProducer,
      this.orderInteractor
    );
  }

  initConfigs(app: Express): void {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.post("/order/create", (req, res, next) => {
      this.orderController.create(req, res);
    });

    app.post("/order/status-update", (req, res, next) => {
      this.orderController.updateStatus(req, res);
    });

    app.post("/order/delete", (req, res, next) => {
      this.orderController.delete(req, res);
    });
  }
}

export default ExpressAdapter;
