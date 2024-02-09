import { PoolClient, QueryResult } from "pg";

import pgPool from "../providers/pgPool";
import OrderEntity from "../entities/OrderEntity";

import { OrderPayload } from "../entities/OrderPayload";
import OrderProductsEntity from "../entities/OrderProductsEntity";
import { OrderStatusPayload } from "../entities/OrderStatusPayload";

class OrderRepository {
  async createOrder(OrderPayload: OrderPayload): Promise<OrderEntity> {
    const pgClient: PoolClient = await pgPool.connect();

    try {
      await pgClient.query("BEGIN");

      const insertOrderQ: string = `INSERT INTO public."order" (id_user, status)
        values ($1, $2)
        returning *`;

      const orderCreated: OrderEntity = (
        await pgClient.query(insertOrderQ, [
          OrderPayload.id_user,
          OrderPayload.status,
        ])
      ).rows[0] as OrderEntity;

      orderCreated.order_products = [];

      for (let index = 0; index < OrderPayload.products.length; index++) {
        const element = OrderPayload.products[index];

        const orderProduct: OrderProductsEntity = new OrderProductsEntity(
          orderCreated.id,
          element.id_product,
          element.quantity
        );

        const insertOrderProductsQ: string = `INSERT INTO public."order_products" (id_order, id_product, quantity)
        values ($1, $2, $3)`;

        await pgClient.query(insertOrderProductsQ, [
          orderProduct.id_order,
          orderProduct.id_product,
          orderProduct.quantity,
        ]);

        orderCreated.order_products.push(orderProduct);
      }

      await pgClient.query("COMMIT");

      return orderCreated;
    } catch (error) {
      await pgClient.query("ROLLBACK");

      throw error;
    } finally {
      await pgClient.release();
    }
  }

  async updateStatusOrder(payload: OrderStatusPayload): Promise<void> {
    const pgClient: PoolClient = await pgPool.connect();

    try {
      await pgClient.query("BEGIN");

      const updateOrderStatusQ: string = `Update public."order" 
        set status = $1
        where id = $2`;

      await pgClient.query(updateOrderStatusQ, [payload.status, payload.id_order]);

      await pgClient.query("COMMIT");
    } catch (error) {
      await pgClient.query("ROLLBACK");

      throw error;
    } finally {
      await pgClient.release();
    }
  }

  async deleteOrder(id_order: string): Promise<OrderProductsEntity[]> {
    const pgClient: PoolClient = await pgPool.connect();

    try {
      await pgClient.query("BEGIN");

      const selectCascadeDeletedProductsQ: string = `Select * from "order_products"
      where id_order = $1`;

      const productsDeleted: OrderProductsEntity[] = (
        await pgClient.query(selectCascadeDeletedProductsQ, [id_order])
      ).rows as OrderProductsEntity[];

      // delete order
      const deletetOrderQ: string = `Delete from "order"
        where id = $1`;

      await pgClient.query(deletetOrderQ, [id_order]);

      await pgClient.query("COMMIT");

      return productsDeleted;
    } catch (error) {
      await pgClient.query("ROLLBACK");

      throw error;
    } finally {
      await pgClient.release();
    }
  }
}

export default OrderRepository;
