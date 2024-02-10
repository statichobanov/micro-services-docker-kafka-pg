import { Logger } from '@nestjs/common';
import { ProductCatalogIRepository } from '../../domain/productCatalog.i.repository';

export class ProductCatalogRepository implements ProductCatalogIRepository {
  async getProductCatalog() {
    Logger.log('Getting product catalog');
    return 'catalog';
  }
}
