import { Logger } from '@nestjs/common';
import { ProductCatalogIRepository } from '../../domain/productCatalog.i.repository';
import { Product } from '../../domain/models/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

export class ProductCatalogRepository implements ProductCatalogIRepository {
  constructor(@InjectRepository(Product) private productsRepository: Repository<Product>) {}

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

  async getProduct(id: string) {
    try {
      const product = await this.productsRepository.findOneBy({ id: +id });
      return JSON.stringify(product);
    } catch (error) {
      Logger.error(error);
    }
  }

  async updateProduct(product: Product) {
    try {
      const response = await this.productsRepository.update(product.id, product);
      return JSON.stringify(response);
    } catch (error) {
      Logger.error(error);
    }
  }

  async removeProduct(product: Product) {
    try {
      const response = await this.productsRepository.delete(product);
      return JSON.stringify(response);
    } catch (error) {
      Logger.error(error);
    }
  }
}
