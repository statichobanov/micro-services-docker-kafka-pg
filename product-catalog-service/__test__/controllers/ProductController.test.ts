import { Request, Response } from "express";

import ProductController from "../../src/controllers/ProductController";
import ProductInteractor from "../../src/interactors/ProductInteractor";
import { ProductPayload } from "../../src/entities/ProductPayload";

jest.mock("../../src/interactors/ProductInteractor");

describe("ProductController", () => {
  let productController: ProductController;
  let productInteractor: ProductInteractor;
  let req: Request;
  let res: Response;

  beforeEach(() => {
    productInteractor = new ProductInteractor();

    productInteractor.create = jest.fn();

    productController = new ProductController(productInteractor);

    req = {} as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  });

  describe("create", () => {
    it("should create a new product", async () => {
      const productPayload: ProductPayload = {
        id: "pord-id-1",
        name: "prod-name-1",
        price: 10,
        quantity: 10,
      };

      req.body = productPayload;
      await productController.create(req, res);

      expect(productInteractor.create).toHaveBeenCalledWith(productPayload);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("update", () => {
    it("should update a product", async () => {
      const productPayload: ProductPayload = {
        id: "pord-id-1",
        name: "updated-prod-name",
        price: 15,
        quantity: 20,
      };

      req.body = productPayload;
      await productController.update(req, res);

      expect(productInteractor.update).toHaveBeenCalledWith(productPayload);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should handle update error", async () => {
      const productPayload: ProductPayload = {
        id: "pord-id-1",
        name: "updated-prod-name",
        price: 15,
        quantity: 20,
      };

      (productInteractor.update as jest.Mock).mockRejectedValue(
        new Error("Update error")
      );

      req.body = productPayload;
      await productController.update(req, res);

      expect(productInteractor.update).toHaveBeenCalledWith(productPayload);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("delete", () => {
    it("should delete a product", async () => {
      req.body = { id: "pord-id-1" };
      await productController.delete(req, res);

      expect(productInteractor.delete).toHaveBeenCalledWith("pord-id-1");
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should handle delete error", async () => {
      (productInteractor.delete as jest.Mock).mockRejectedValue(
        new Error("Delete error")
      );

      req.body = { id: "pord-id-1" };
      await productController.delete(req, res);

      expect(productInteractor.delete).toHaveBeenCalledWith("pord-id-1");
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
