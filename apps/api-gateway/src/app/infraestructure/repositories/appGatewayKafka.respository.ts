import { Inject, OnModuleInit } from '@nestjs/common';
import { ApiGatewayIRepository } from '../../domain/apiGateway.i.repository';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { LoginModel, OrderModel, ProductModel, UserModel } from '@ecommerce/models';

export class ApiGatewayKafkaRepository implements ApiGatewayIRepository, OnModuleInit {
  constructor(
    @Inject(`KAFKA_CLIENT`)
    private readonly kafkaClient: ClientKafka
  ) {}
  async getProductCatalog() {
    const message = JSON.stringify({
      type: 'get-list',
      data: undefined,
    });
    return await lastValueFrom(this.kafkaClient.send('product-events', message));
  }

  async getProduct(id: string) {
    const message = JSON.stringify({
      type: 'get-product',
      data: id,
    });
    return await lastValueFrom(this.kafkaClient.send('product-events', message));
  }

  async createProduct(product: ProductModel) {
    const message = JSON.stringify({
      type: 'create-product',
      data: product,
    });
    return await lastValueFrom(this.kafkaClient.send('product-events', message));
  }

  async updateProduct(product: ProductModel) {
    const message = JSON.stringify({
      type: 'update-product',
      data: product,
    });
    return await lastValueFrom(this.kafkaClient.send('product-events', message));
  }

  async removeProduct(id: string) {
    const message = JSON.stringify({
      type: 'remove-product',
      data: id,
    });
    return await lastValueFrom(this.kafkaClient.send('product-events', message));
  }

  async authenticate(login: LoginModel) {
    const message = JSON.stringify({
      type: 'login',
      data: login,
    });
    return await lastValueFrom(this.kafkaClient.send('user-events', message));
  }

  async createOrder(order: OrderModel) {
    const message = JSON.stringify({
      type: 'create-order',
      data: order,
    });
    return await lastValueFrom(this.kafkaClient.send('order-events', message));
  }

  async createUser(user: UserModel) {
    const message = JSON.stringify({
      type: 'create-user',
      data: user,
    });
    return await lastValueFrom(this.kafkaClient.send('user-events', message));
  }
  onModuleInit() {
    this.kafkaClient.subscribeToResponseOf(`product-events`);
    this.kafkaClient.subscribeToResponseOf(`user-events`);
    this.kafkaClient.subscribeToResponseOf(`order-events`);
  }
}
