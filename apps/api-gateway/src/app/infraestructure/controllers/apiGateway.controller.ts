import { Controller, Get, Inject, Post } from '@nestjs/common';
import { Authenticate } from '../../aplication/authenticate.service';
import { CreateOrder } from '../../aplication/createOrder.service';
import { GetProductCatalog } from '../../aplication/getProductCatalog.service';

@Controller()
export class ApiGatewayController {
  constructor(
    @Inject(Authenticate)
    private authenticate: Authenticate,
    @Inject(CreateOrder)
    private createOrder: CreateOrder,
    @Inject(GetProductCatalog)
    private getProductCatalog: GetProductCatalog
  ) {}

  @Post('authentication') // authenticateToken
  handleAuthenticate() {
    return this.authenticate.run({});
  }

  @Post('order/create')
  handleCreateOrder() {
    return this.createOrder.run({});
  }

  @Get('product-catalog')
  async handleGetProductCatalog() {
    return await this.getProductCatalog.run();
  }
}
