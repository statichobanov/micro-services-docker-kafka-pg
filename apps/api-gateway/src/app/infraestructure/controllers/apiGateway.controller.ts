import { Body, Controller, Delete, Get, Inject, OnModuleInit, Post, Put, Query } from '@nestjs/common';
import { GetProductCatalog } from '../../aplication/getProductCatalog.service';
import { RemoveProduct } from '../../aplication/removeProduct.service';
import { CreateProduct } from '../../aplication/createProduct.service';
import { GetProduct } from '../../aplication/getProduct.service';
import { UpdateProduct } from '../../aplication/updateProduct.service';
import { ClientKafka } from '@nestjs/microservices';
import { Authenticate } from '../../aplication/authenticate.service';
import { CreateOrder } from '../../aplication/createOrder.service';

@Controller('')
export class ApiGatewayController implements OnModuleInit {
  constructor(
    @Inject(GetProductCatalog) private getProductCatalog: GetProductCatalog,
    @Inject(GetProduct) private getProduct: GetProduct,
    @Inject(CreateProduct) private createProduct: CreateProduct,
    @Inject(UpdateProduct) private updateProduct: UpdateProduct,
    @Inject(RemoveProduct) private removeProduct: RemoveProduct,
    @Inject(Authenticate) private authenticate: Authenticate,
    @Inject(CreateOrder) private createOrder: CreateOrder,
    @Inject(`KAFKA_CLIENT`) private readonly kafkaClient: ClientKafka
  ) {}

  @Get('product')
  async handleGetProduct(@Query() id: string) {
    return await this.getProduct.run(id);
  }

  @Get('/product/list')
  async handleGetProductCatalog() {
    return await this.getProductCatalog.run();
  }

  @Post('product')
  async handleCreateProduct(@Body() body) {
    return await this.createProduct.run(body);
  }

  @Put('product')
  async handleUpdateProduct(@Body() body) {
    return await this.updateProduct.run(body);
  }

  @Delete('product')
  async handleRemoveProduct(@Body() body) {
    return await this.removeProduct.run(body);
  }

  @Post('auth') // authenticateToken
  handleAuthenticate() {
    return this.authenticate.run({});
  }

  @Post('order')
  handleCreateOrder() {
    return this.createOrder.run({});
  }

  async onModuleInit() {
    await this.kafkaClient.connect();
  }
}
