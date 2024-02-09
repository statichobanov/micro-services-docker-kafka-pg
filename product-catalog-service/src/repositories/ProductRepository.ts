import { PoolClient, QueryResult } from "pg";

import pgPool from "../providers/pgPool";
import ProductEntity from "../entities/ProductEntity";
import { ProductPayload } from "../entities/ProductPayload";
import OrderProductsEntity from "../entities/OrderProductsEntity";

class ProductRepository {
  async createProduct(productPayload: ProductPayload): Promise<ProductEntity> {
    const pgClient: PoolClient = await pgPool.connect();

    try {
      await pgClient.query("BEGIN");

      const insertQ: string = `INSERT INTO public."product" (name, price,quantity)
        values ($1, $2, $3)
        ON CONFLICT (name)
        DO UPDATE
        SET price = $2, quantity = "product".quantity + $3
        returning *`;

      const productCreated: ProductEntity = (
        await pgClient.query(insertQ, [
          productPayload.name,
          productPayload.price,
          productPayload.quantity,
        ])
      ).rows[0] as ProductEntity;

      await pgClient.query("COMMIT");

      return productCreated;
    } catch (error) {
      await pgClient.query("ROLLBACK");

      throw error;
    } finally {
      await pgClient.release();
    }
  }

  async updateProduct(productPayload: ProductPayload): Promise<ProductEntity> {
    const pgClient: PoolClient = await pgPool.connect();

    try {
      await pgClient.query("BEGIN");

      const insertQ: string = `UPDATE public."product"
        set name = $2, price = $3, quantity = $4
        where id = $1
        returning *`;

      const productUpdated: ProductEntity = (
        await pgClient.query(insertQ, [
          productPayload.id,
          productPayload.name,
          productPayload.price,
          productPayload.quantity,
        ])
      ).rows[0] as ProductEntity;

      await pgClient.query("COMMIT");

      return productUpdated;
    } catch (error) {
      await pgClient.query("ROLLBACK");

      throw error;
    } finally {
      await pgClient.release();
    }
  }

  async deleteProduct(productId: string): Promise<void> {
    const pgClient: PoolClient = await pgPool.connect();

    try {
      await pgClient.query("BEGIN");

      const deleteQ: string = `Delete from "product"
      where id = $1`;

      await pgClient.query(deleteQ, [productId]);

      await pgClient.query("COMMIT");
    } catch (error) {
      await pgClient.query("ROLLBACK");

      throw error;
    } finally {
      await pgClient.release();
    }
  }

  async addQuantity(product: OrderProductsEntity): Promise<void> {
    const pgClient: PoolClient = await pgPool.connect();

    try {
      await pgClient.query("BEGIN");

      const insertQ: string = `UPDATE public."product"
        set quantity = "product".quantity + $2
        where id = $1
        returning *`;

      await pgClient.query(insertQ, [product.id_product, product.quantity]);

      await pgClient.query("COMMIT");
    } catch (error) {
      await pgClient.query("ROLLBACK");

      console.log("da error:", error);

      throw error;
    } finally {
      await pgClient.release();
    }
  }

  async removeQuantity(product: OrderProductsEntity): Promise<void> {
    const pgClient: PoolClient = await pgPool.connect();

    try {
      await pgClient.query("BEGIN");

      const insertQ: string = `UPDATE public."product"
        set quantity = "product".quantity - $2
        where id = $1
        returning *`;

      await pgClient.query(insertQ, [product.id_product, product.quantity]);

      await pgClient.query("COMMIT");
    } catch (error) {
      await pgClient.query("ROLLBACK");

      console.log("da error:", error);

      throw error;
    } finally {
      await pgClient.release();
    }
  }
}

export default ProductRepository;
