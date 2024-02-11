import { Inject, Logger, NotFoundException } from '@nestjs/common';
import { ProductCatalogIRepository } from '../../domain/productCatalog.i.repository';
import { Product } from '@ecommerce/models';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientKafka } from '@nestjs/microservices';

export class ProductCatalogRepository implements ProductCatalogIRepository {
  constructor(
    @Inject(`KAFKA_CLIENT`) private readonly kafkaClient: ClientKafka,
    @InjectRepository(Product) private productsRepository: Repository<Product>
  ) {}

  async getProduct(id: string) {
    try {
      const product = await this.productsRepository.findOneBy({ id: +id });
      if (product) {
        return JSON.stringify(product);
      } else {
        throw new NotFoundException();
      }
    } catch (error) {
      Logger.error(error);
    }
  }

  async getProductCatalog(): Promise<string> {
    try {
      const products = await this.productsRepository.find();
      return JSON.stringify(products);
    } catch (error) {
      Logger.error(error);
    }
  }

  async createProduct(product: Product) {
    try {
      const response = await this.productsRepository.save(product);
      return JSON.stringify(response);
    } catch (error) {
      Logger.error(error);
    }
  }

  async updateProduct(product: Product): Promise<string> {
    try {
      const result = await this.productsRepository.update(product.id, product);
      if (result.affected > 0) {
        const message = JSON.stringify({
          type: 'product-updated',
          data: product,
        });
        this.kafkaClient.emit('product-events', message);
        return JSON.stringify({ result: 'ok' });
      } else {
        throw new NotFoundException();
      }
    } catch (error) {
      Logger.error(error);
    }
  }

  async removeProduct(id: string): Promise<string> {
    try {
      const result = await this.productsRepository.delete(id);
      // TODO: Implements event to update order
      if (result.affected > 0) {
        return JSON.stringify({ result: 'ok' });
      } else {
        throw new NotFoundException();
      }
    } catch (error) {
      Logger.error(error);
    }
  }
}
