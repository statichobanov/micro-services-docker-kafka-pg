import { Request, Response } from "express";
import ProductInteractor from "../interactors/ProductInteractor";
import { ProductPayload } from "../entities/ProductPayload";
import ProductEntity from "../entities/ProductEntity";

export interface AuthenticatedRequest extends Request {
  accessToken?: string;
  user: { id: string };
}

class ProductController {
  private productInteractor: ProductInteractor;

  constructor(orederInteractor: ProductInteractor) {
    this.productInteractor = orederInteractor;
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const productPayload = req.body as ProductPayload;

      const newProduct: ProductEntity = await this.productInteractor.create(
        productPayload
      );

      res.status(200).json({ newProduct });
    } catch (error) {
      console.log("Error:", error);

      res.status(500).json({ message: "Internal server error" });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const productPayload = req.body as ProductPayload;

      const updatedProduct: ProductEntity = await this.productInteractor.update(
        productPayload
      );

      res.status(200).json({ updatedProduct });
    } catch (error: any) {
      if (error.code == "23505") {
        res.status(500).json({ message: "Name already taken" });
      }

      res.status(500).json({ message: "Internal server error" });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const productId: string = req.body.id;

      await this.productInteractor.delete(productId);

      res.status(200).json({ message: "Success" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default ProductController;
