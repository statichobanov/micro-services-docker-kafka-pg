import { Module } from '@nestjs/common';

import { ProductCatalogController } from './productCatalog.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GetProductCatalog } from '../../aplication/getProductCatalog.service';
import { ProductCatalogRepository } from '../repositories/productCatalog.repository';
import { ProductCatalogIRepository } from '../../domain/productCatalog.i.repository';
import { Product } from '../../domain/models/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetProduct } from '../../aplication/getProduct.service';
import { CreateProduct } from '../../aplication/createProduct.service';
import { UpdateProduct } from '../../aplication/updateProduct.service';
import { RemoveProduct } from '../../aplication/removeProduct.service';
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
    TypeOrmModule.forFeature([Product]),
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
    {
      provide: GetProduct,
      useFactory(productCatalogRepository: ProductCatalogIRepository) {
        return new GetProduct(productCatalogRepository);
      },
      inject: [ProductCatalogRepository],
    },
    {
      provide: CreateProduct,
      useFactory(productCatalogRepository: ProductCatalogIRepository) {
        return new CreateProduct(productCatalogRepository);
      },
      inject: [ProductCatalogRepository],
    },
    {
      provide: UpdateProduct,
      useFactory(productCatalogRepository: ProductCatalogIRepository) {
        return new UpdateProduct(productCatalogRepository);
      },
      inject: [ProductCatalogRepository],
    },
    {
      provide: RemoveProduct,
      useFactory(productCatalogRepository: ProductCatalogIRepository) {
        return new RemoveProduct(productCatalogRepository);
      },
      inject: [ProductCatalogRepository],
    },
  ],
})
export class ProductCatalogModule {}
