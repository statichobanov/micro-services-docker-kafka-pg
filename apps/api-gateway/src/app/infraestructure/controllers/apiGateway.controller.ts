import { Body, Controller, Delete, Get, Inject, OnModuleInit, Post, Put, Query } from '@nestjs/common';
import { GetProductCatalog } from '../../aplication/getProductCatalog.service';
import { RemoveProduct } from '../../aplication/removeProduct.service';
import { CreateProduct } from '../../aplication/createProduct.service';
import { GetProduct } from '../../aplication/getProduct.service';
import { UpdateProduct } from '../../aplication/updateProduct.service';
import { ClientKafka } from '@nestjs/microservices';
import { Authenticate } from '../../aplication/authenticate.service';
import { CreateOrder } from '../../aplication/createOrder.service';
import { ApiOperation, ApiTags, ApiResponse, ApiBody, ApiQuery } from '@nestjs/swagger';
import { LoginModel, OrderModel, ProductModel, UserModel } from '@ecommerce/models';
import { CreateUser } from '../../aplication/createUser.service';
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
    @Inject(CreateUser) private createUser: CreateUser,
    @Inject(`KAFKA_CLIENT`) private readonly kafkaClient: ClientKafka
  ) {}

  @ApiTags('product')
  @ApiOperation({ summary: 'Get Product', description: 'Get a product by id.' })
  @ApiQuery({ name: 'id', type: String, description: 'The ID of the product to retrieve.' })
  @ApiResponse({ status: 200, description: 'The product was found.', type: ProductModel })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @Get('product')
  async handleGetProduct(@Query() id: string): Promise<ProductModel> {
    return await this.getProduct.run(id);
  }

  @ApiTags('product')
  @ApiOperation({ summary: 'Get Products List', description: 'Get products list.' })
  @ApiResponse({ status: 200, description: 'The products was found.', type: Array<ProductModel> })
  @ApiResponse({ status: 404, description: 'Products not found.' })
  @Get('/product/list')
  async handleGetProductCatalog(): Promise<ProductModel[]> {
    return await this.getProductCatalog.run();
  }

  @ApiTags('product')
  @ApiOperation({ summary: 'Create Product', description: 'Create a product.' })
  @ApiBody({ type: ProductModel })
  @ApiResponse({ status: 201, description: 'The product has been created successfully.', type: ProductModel })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @Post('product')
  async handleCreateProduct(@Body() body: ProductModel): Promise<{ result: string }> {
    return await this.createProduct.run(body);
  }

  @ApiTags('product')
  @ApiOperation({ summary: 'Update Product', description: 'Update a product.' })
  @ApiBody({ type: ProductModel, description: 'The payload to update a product.' })
  @ApiResponse({ status: 200, description: 'Product updated successfully.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @Put('product')
  async handleUpdateProduct(@Body() body: ProductModel): Promise<ProductModel> {
    return await this.updateProduct.run(body);
  }

  @ApiTags('product')
  @ApiOperation({ summary: 'Remove Product', description: 'Remove a product.' })
  @ApiQuery({ name: 'id', type: String, description: 'The ID of the product to retrieve.' })
  @ApiResponse({ status: 200, description: 'Product removed successfully.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @Delete('product')
  async handleRemoveProduct(@Query() id: string): Promise<string> {
    return await this.removeProduct.run(id);
  }

  @ApiTags('authentication')
  @ApiOperation({ summary: 'Create User', description: 'Create an user.' })
  @ApiBody({ type: UserModel })
  @ApiResponse({ status: 200, description: 'User created successfully.', type: UserModel })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @Post('auth')
  handleCreateUser(@Body() body: UserModel) {
    return this.createUser.run(body);
  }

  @ApiTags('authentication')
  @ApiOperation({ summary: 'Authenticate', description: 'Authenticate an user.' })
  @ApiBody({ type: LoginModel })
  @ApiResponse({ status: 200, description: 'User authenticated successfully.', type: Object })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Post('auth/login')
  handleAuthenticate(@Body() body: LoginModel) {
    return this.authenticate.run(body);
  }

  @ApiTags('order')
  @ApiOperation({ summary: 'Create Order', description: 'Create an order.' })
  @ApiBody({ type: OrderModel })
  @ApiResponse({ status: 201, description: 'Order created successfully.', type: OrderModel })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @Post('order')
  handleCreateOrder() {
    return this.createOrder.run({});
  }

  async onModuleInit() {
    await this.kafkaClient.connect();
  }
}
