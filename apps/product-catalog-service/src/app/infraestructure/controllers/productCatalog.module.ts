import { Module } from '@nestjs/common';

import { ProductCatalogController } from './productCatalog.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GetProductCatalog } from '../../aplication/getProductCatalog.service';
import { ProductCatalogRepository } from '../repositories/productCatalog.repository';
import { ProductCatalogIRepository } from '../../domain/productCatalog.i.repository';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'product-catalog-service',
            brokers: ['kafka:9092'],
          },
          consumer: {
            groupId: 'product-catalog-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [ProductCatalogController],
  providers: [
    ProductCatalogRepository,
    {
      provide: GetProductCatalog,
      useFactory(productCatalogRepository: ProductCatalogIRepository) {
        return new GetProductCatalog(productCatalogRepository);
      },
      inject: [ProductCatalogRepository],
    },
  ],
})
export class ProductCatalogModule {}
