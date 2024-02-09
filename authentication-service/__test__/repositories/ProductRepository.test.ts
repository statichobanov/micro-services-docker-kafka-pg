import ProductRepository from "../../src/repositories/ProductRepository";
import pgPool from "../../src/providers/pgPool";
import { ProductPayload } from "../../src/entities/ProductPayload";
import OrderProductsEntity from "../../src/entities/OrderProductsEntity";

jest.mock("../../src/providers/pgPool");

describe("ProductRepository", () => {
  let productRepository: ProductRepository;

  beforeEach(() => {
    productRepository = new ProductRepository();
  });

  describe("createProduct", () => {
    it("should create a new product", async () => {
      const mockClient = {
        query: jest.fn().mockResolvedValue({
          rows: [{ id: "1", name: "product", price: 10, quantity: 5 }],
        }),
        release: jest.fn(),
      };
      (pgPool.connect as jest.Mock).mockResolvedValue(mockClient);

      const productPayload = {
        name: "product",
        price: 10,
        quantity: 5,
      } as ProductPayload;

      const result = await productRepository.createProduct(productPayload);

      expect(result).toEqual({
        id: "1",
        name: "product",
        price: 10,
        quantity: 5,
      });
      expect(pgPool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalled();
      expect(mockClient.release).toHaveBeenCalled();
    });
  });

  describe("updateProduct", () => {
    it("should update an existing product", async () => {
      const mockClient = {
        query: jest.fn().mockResolvedValue({
          rows: [{ id: "1", name: "updated product", price: 15, quantity: 8 }],
        }),
        release: jest.fn(),
      };
      (pgPool.connect as jest.Mock).mockResolvedValue(mockClient);

      const productPayload = {
        id: "1",
        name: "updated product",
        price: 15,
        quantity: 8,
      };

      const result = await productRepository.updateProduct(productPayload);

      expect(result).toEqual({
        id: "1",
        name: "updated product",
        price: 15,
        quantity: 8,
      });
      expect(pgPool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalled();
      expect(mockClient.release).toHaveBeenCalled();
    });
  });

  describe("deleteProduct", () => {
    it("should delete a product", async () => {
      const mockClient = {
        query: jest.fn().mockResolvedValue({}),
        release: jest.fn(),
      };
      (pgPool.connect as jest.Mock).mockResolvedValue(mockClient);

      const productId = "1";

      await productRepository.deleteProduct(productId);

      expect(pgPool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalled();
      expect(mockClient.release).toHaveBeenCalled();
    });
  });

  describe("addQuantity", () => {
    it("should add quantity to a product", async () => {
      // Mocking the PoolClient
      const mockClient = {
        query: jest.fn().mockResolvedValue({}),
        release: jest.fn(),
      };
      (pgPool.connect as jest.Mock).mockResolvedValue(mockClient);

      const orderProduct = {
        id_product: "1",
        quantity: 5,
      } as OrderProductsEntity;

      await productRepository.addQuantity(orderProduct);

      expect(pgPool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalled();
      expect(mockClient.release).toHaveBeenCalled();
    });
  });

  describe("removeQuantity", () => {
    it("should remove quantity from a product", async () => {
      const mockClient = {
        query: jest.fn().mockResolvedValue({}),
        release: jest.fn(),
      };
      (pgPool.connect as jest.Mock).mockResolvedValue(mockClient);

      const orderProduct = { id_product: "1", quantity: 3 };

      await productRepository.removeQuantity(
        orderProduct as OrderProductsEntity
      );

      expect(pgPool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalled();
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
});
