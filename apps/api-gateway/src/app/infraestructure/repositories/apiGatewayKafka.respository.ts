import { Inject, OnModuleInit } from '@nestjs/common';
import { ApiGatewayIRepository } from '../../domain/apiGateway.i.repository';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { LoginModel, OrderModel, ProductModel, UserModel } from '@ecommerce/models';
import { ErrorHandler } from '@ecommerce/error';

/**
 * Repository class for API Gateway with Kafka communication.
 */
export class ApiGatewayKafkaRepository implements ApiGatewayIRepository, OnModuleInit {
  constructor(@Inject(`KAFKA_CLIENT`) private readonly kafkaClient: ClientKafka) {}

  /**
   * Fetches the product catalog.
   * @returns A promise that resolves to an array of ProductModels.
   */
  async getProductCatalog(): Promise<ProductModel[]> {
    const message = JSON.stringify({ type: 'get-list', data: undefined });
    try {
      return await lastValueFrom(this.kafkaClient.send('product-events', message));
    } catch (error) {
      ErrorHandler.handleError(error.message, error.errorCode, 'ApiGatewayKafkaRespository.getProductCatalog()');
    }
  }

  /**
   * Fetches a single product by ID.
   * @param id The ID of the product to fetch.
   * @returns A promise that resolves to a ProductModel.
   */
  async getProduct(id: string): Promise<ProductModel> {
    const message = JSON.stringify({ type: 'get-product', data: id });
    try {
      return await lastValueFrom(this.kafkaClient.send('product-events', message));
    } catch (error) {
      ErrorHandler.handleError(error.message, error.errorCode, 'ApiGatewayKafkaRespository.getProduct()');
    }
  }

  /**
   * Creates a new product.
   * @param product The product to create.
   * @returns A promise that resolves to the created ProductModel.
   */
  async createProduct(product: ProductModel): Promise<ProductModel> {
    const message = JSON.stringify({ type: 'create-product', data: product });
    try {
      return await lastValueFrom(this.kafkaClient.send('product-events', message));
    } catch (error) {
      ErrorHandler.handleError(error.message, error.errorCode, 'ApiGatewayKafkaRespository.createProduct()');
    }
  }

  /**
   * Updates an existing product.
   * @param product The product to update.
   * @returns A promise that resolves to an object indicating the result of the update operation.
   */
  async updateProduct(product: ProductModel): Promise<{ result: string }> {
    const message = JSON.stringify({ type: 'update-product', data: product });
    try {
      return await lastValueFrom(this.kafkaClient.send('product-events', message));
    } catch (error) {
      ErrorHandler.handleError(error.message, error.errorCode, 'ApiGatewayKafkaRespository.updateProduct()');
    }
  }

  /**
   * Removes a product by ID.
   * @param id The ID of the product to remove.
   * @returns A promise that resolves to an object indicating the result of the removal operation.
   */
  async removeProduct(id: string): Promise<{ result: string }> {
    const message = JSON.stringify({ type: 'remove-product', data: id });
    try {
      return await lastValueFrom(this.kafkaClient.send('product-events', message));
    } catch (error) {
      ErrorHandler.handleError(error.message, error.errorCode, 'ApiGatewayKafkaRespository.removeProduct()');
    }
  }

  /**
   * Authenticates a user.
   * @param login The login model containing authentication details.
   * @returns A promise that resolves to an object containing the authentication token.
   */
  async authenticate(login: LoginModel): Promise<{ token: string }> {
    const message = JSON.stringify({ type: 'login', data: login });
    try {
      return await lastValueFrom(this.kafkaClient.send('user-events', message));
    } catch (error) {
      ErrorHandler.handleError(error.message, error.errorCode, 'ApiGatewayKafkaRespository.authenticate()');
    }
  }

  /**
   * Creates a new order.
   * @param order The order model to create.
   * @returns A promise that resolves to the created OrderModel.
   */
  async createOrder(order: OrderModel): Promise<OrderModel> {
    const message = JSON.stringify({ type: 'create-order', data: order });
    try {
      return await lastValueFrom(this.kafkaClient.send('order-events', message));
    } catch (error) {
      ErrorHandler.handleError(error.message, error.errorCode, 'ApiGatewayKafkaRespository.createOrder()');
    }
  }

  /**
   * Creates a new user.
   * @param user The user model to create.
   * @returns A promise that resolves to the created UserModel, omitting the password.
   */
  async createUser(user: UserModel): Promise<Omit<UserModel, 'password'>> {
    const message = JSON.stringify({ type: 'create-user', data: user });
    try {
      return await lastValueFrom(this.kafkaClient.send('user-events', message));
    } catch (error) {
      ErrorHandler.handleError(error.message, error.errorCode, 'ApiGatewayKafkaRespository.createUser()');
    }
  }

  /**
   * Initializes subscriptions to Kafka topics on module initialization.
   */
  onModuleInit() {
    // Subscribes to Kafka topics for product, user, and order events.
    this.kafkaClient.subscribeToResponseOf(`product-events`);
    this.kafkaClient.subscribeToResponseOf(`user-events`);
    this.kafkaClient.subscribeToResponseOf(`order-events`);
  }
}
