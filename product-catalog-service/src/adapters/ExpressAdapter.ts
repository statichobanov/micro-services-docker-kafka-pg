import express, { Express } from "express";

import ProductController from "../controllers/ProductController";
import ProductInteractor from "../interactors/ProductInteractor";

class ExpressAdapter {
  private productController: ProductController;
  private productInteractor: ProductInteractor;
  constructor() {
    this.productInteractor = new ProductInteractor();
    this.productController = new ProductController(this.productInteractor);
  }

  initConfigs(app: Express): void {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.post("/product-catalog/create", (req, res, next) => {
      this.productController.create(req, res);
    });

    app.post("/product-catalog/update", (req, res, next) => {
      this.productController.update(req, res);
    });

    app.post("/product-catalog/delete", (req, res, next) => {
      this.productController.delete(req, res);
    });
  }
}

export default ExpressAdapter;
