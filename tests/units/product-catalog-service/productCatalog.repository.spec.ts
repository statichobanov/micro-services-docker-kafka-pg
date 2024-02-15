import { Test } from '@nestjs/testing';
import { ProductCatalogRepository } from '../../../apps/product-catalog-service/src/app/infraestructure/repositories/productCatalog.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../../../libs/models/src/lib/entities/product.entity';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';

const mockProductsRepository = () => ({
  findOneBy: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

const mockClientKafka = () => ({
  emit: jest.fn(),
});

describe('ProductCatalogRepository', () => {
  let productCatalogRepository: ProductCatalogRepository;
  let productsRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ProductCatalogRepository,
        { provide: getRepositoryToken(Product), useFactory: mockProductsRepository },
        { provide: `KAFKA_CLIENT`, useFactory: mockClientKafka },
      ],
    }).compile();

    productCatalogRepository = module.get<ProductCatalogRepository>(ProductCatalogRepository);
    productsRepository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  describe('getProduct', () => {
    it('should return the found product', async () => {
      const mockProduct = { id: 1, name: 'Test Product', value: 100, amount: 10 };
      productsRepository.findOneBy.mockResolvedValue(mockProduct);
      const result = await productCatalogRepository.getProduct('1');
      expect(result).toEqual(mockProduct);
      expect(productsRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw HttpException if no product is found', async () => {
      productsRepository.findOneBy.mockResolvedValue(undefined);
      await expect(productCatalogRepository.getProduct('1')).rejects.toThrow(HttpException);
    });
  });

  // Continuando desde el último ejemplo...

  describe('getProductCatalog', () => {
    it('should return an array of products', async () => {
      const mockProducts = [{ id: 'someId1', name: 'Test Product 1', value: 100, amount: 10 }];
      productsRepository.find.mockResolvedValue(mockProducts);
      const result = await productCatalogRepository.getProductCatalog();
      expect(result).toEqual(mockProducts);
    });
  });

  describe('createProduct', () => {
    it('should successfully create a product', async () => {
      const mockProduct = { id: 1, name: 'New Product', value: 200, amount: 5 };
      productsRepository.save.mockResolvedValue(mockProduct);
      const result = await productCatalogRepository.createProduct(mockProduct);
      expect(result).toEqual(mockProduct);
      expect(productsRepository.save).toHaveBeenCalledWith(mockProduct);
    });
  });

  describe('updateProduct', () => {
    it('should update the product if it exists', async () => {
      const mockProduct = { id: 1, name: 'Updated Product', value: 300, amount: 8 };
      productsRepository.update.mockResolvedValue({ affected: 1 });
      const result = await productCatalogRepository.updateProduct(mockProduct);
      expect(result).toEqual({ result: 'ok' });
      expect(productsRepository.update).toHaveBeenCalledWith(mockProduct.id, mockProduct);
    });

    it('should throw HttpException if no product was updated', async () => {
      productsRepository.update.mockResolvedValue({ affected: 0 });
      await expect(
        productCatalogRepository.updateProduct({ id: 1, name: 'product', value: 15, amount: 10 })
      ).rejects.toThrow(HttpException);
    });
  });

  describe('removeProduct', () => {
    it('should remove the product if it exists', async () => {
      productsRepository.delete.mockResolvedValue({ affected: 1 });
      const result = await productCatalogRepository.removeProduct('someId');
      expect(result).toEqual({ result: 'ok' });
      expect(productsRepository.delete).toHaveBeenCalledWith('someId');
    });

    it('should throw HttpException if no product was removed', async () => {
      productsRepository.delete.mockResolvedValue({ affected: 0 });
      await expect(productCatalogRepository.removeProduct('someId')).rejects.toThrow(HttpException);
    });
  });
});
