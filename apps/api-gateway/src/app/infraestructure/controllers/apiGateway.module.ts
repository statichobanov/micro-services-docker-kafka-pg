import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Authenticate } from '../../aplication/authenticate.service';
import { CreateOrder } from '../../aplication/createOrder.service';
import { CreateProduct } from '../../aplication/createProduct.service';
import { GetProduct } from '../../aplication/getProduct.service';
import { GetProductCatalog } from '../../aplication/getProductCatalog.service';
import { RemoveProduct } from '../../aplication/removeProduct.service';
import { UpdateProduct } from '../../aplication/updateProduct.service';
import { ApiGatewayKafkaRepository } from '../repositories/apiGatewayKafka.respository';
import { ApiGatewayController } from './apiGateway.controller';
import { ApiGatewayIRepository } from '../../domain/apiGateway.i.repository';
import { CreateUser } from '../../aplication/createUser.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'api-gateway-product',
            brokers: ['kafka:9092'],
          },
          consumer: {
            groupId: 'api-gateway-product-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [ApiGatewayController],
  providers: [
    ApiGatewayKafkaRepository,
    {
      provide: GetProductCatalog,
      useFactory(apiGatewayRepository: ApiGatewayIRepository) {
        return new GetProductCatalog(apiGatewayRepository);
      },
      inject: [ApiGatewayKafkaRepository],
    },
    {
      provide: GetProduct,
      useFactory(apiGatewayRepository: ApiGatewayIRepository) {
        return new GetProduct(apiGatewayRepository);
      },
      inject: [ApiGatewayKafkaRepository],
    },
    {
      provide: CreateProduct,
      useFactory(apiGatewayRepository: ApiGatewayIRepository) {
        return new CreateProduct(apiGatewayRepository);
      },
      inject: [ApiGatewayKafkaRepository],
    },
    {
      provide: UpdateProduct,
      useFactory(apiGatewayRepository: ApiGatewayIRepository) {
        return new UpdateProduct(apiGatewayRepository);
      },
      inject: [ApiGatewayKafkaRepository],
    },
    {
      provide: RemoveProduct,
      useFactory(apiGatewayRepository: ApiGatewayIRepository) {
        return new RemoveProduct(apiGatewayRepository);
      },
      inject: [ApiGatewayKafkaRepository],
    },
    {
      provide: CreateOrder,
      useFactory(apiGatewayRepository: ApiGatewayIRepository) {
        return new CreateOrder(apiGatewayRepository);
      },
      inject: [ApiGatewayKafkaRepository],
    },
    {
      provide: Authenticate,
      useFactory(apiGatewayRepository: ApiGatewayIRepository) {
        return new Authenticate(apiGatewayRepository);
      },
      inject: [ApiGatewayKafkaRepository],
    },
    {
      provide: CreateUser,
      useFactory(apiGatewayRepository: ApiGatewayIRepository) {
        return new CreateUser(apiGatewayRepository);
      },
      inject: [ApiGatewayKafkaRepository],
    },
  ],
})
export class ApiGatewayModule {}
