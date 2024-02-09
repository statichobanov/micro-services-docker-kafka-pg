import ProductInteractor from "../../src/interactors/ProductInteractor";
import ProductRepository from "../../src/repositories/ProductRepository";
import { ProductPayload } from "../../src/entities/ProductPayload";
import OrderProductsEntity from "../../src/entities/OrderProductsEntity";

jest.mock("../../src/repositories/ProductRepository");

describe("ProductInteractor", () => {
  let productInteractor: ProductInteractor;
  let mockProductRepository: jest.Mocked<ProductRepository>;

  beforeEach(() => {
    mockProductRepository = {
      createProduct: jest.fn(),
      updateProduct: jest.fn(),
      addQuantity: jest.fn(),
      removeQuantity: jest.fn(),
      deleteProduct: jest.fn(),
    } as unknown as jest.Mocked<ProductRepository>;

    productInteractor = new ProductInteractor();

    (productInteractor as any).productRepository = mockProductRepository;
  });

  describe("create", () => {
    it("should create a new product", async () => {
      const productPayload: ProductPayload = {
        id: "1",
        name: "Product 1",
        price: 10,
        quantity: 100,
      };
      const mockProductEntity = {
        id: "1",
        name: "Product 1",
        price: 10,
        quantity: 100,
      };

      mockProductRepository.createProduct.mockResolvedValue(mockProductEntity);

      const result = await productInteractor.create(productPayload);

      expect(mockProductRepository.createProduct).toHaveBeenCalledWith(
        productPayload
      );
      expect(result).toEqual(mockProductEntity);
    });
  });

  describe("update", () => {
    it("should update a product", async () => {
      const productPayload: ProductPayload = {
        id: "1",
        name: "Updated Product",
        price: 20,
        quantity: 200,
      };
      const mockProductEntity = {
        id: "1",
        name: "Updated Product",
        price: 20,
        quantity: 200,
      };

      mockProductRepository.updateProduct.mockResolvedValue(mockProductEntity);

      const result = await productInteractor.update(productPayload);

      expect(mockProductRepository.updateProduct).toHaveBeenCalledWith(
        productPayload
      );
      expect(result).toEqual(mockProductEntity);
    });
  });

  describe("addQuantities", () => {
    it("should add quantities to products", async () => {
      const mockOrderProducts: OrderProductsEntity[] = [
        { id_order: "1", id_product: "1", quantity: 10 },
        { id_order: "2", id_product: "2", quantity: 20 },
      ];

      await productInteractor.addQuantities(mockOrderProducts);

      expect(mockProductRepository.addQuantity).toHaveBeenCalledTimes(2);
      expect(mockProductRepository.addQuantity).toHaveBeenCalledWith(
        mockOrderProducts[0]
      );
      expect(mockProductRepository.addQuantity).toHaveBeenCalledWith(
        mockOrderProducts[1]
      );
    });
  });

  describe("removeQuantities", () => {
    it("should remove quantities from products", async () => {
      const mockOrderProducts: OrderProductsEntity[] = [
        { id_order: "1", id_product: "1", quantity: 5 },
        { id_order: "2", id_product: "2", quantity: 10 },
      ];

      await productInteractor.removeQuantities(mockOrderProducts);

      expect(mockProductRepository.removeQuantity).toHaveBeenCalledTimes(2);
      expect(mockProductRepository.removeQuantity).toHaveBeenCalledWith(
        mockOrderProducts[0]
      );
      expect(mockProductRepository.removeQuantity).toHaveBeenCalledWith(
        mockOrderProducts[1]
      );
    });
  });

  describe("delete", () => {
    it("should delete a product", async () => {
      const productId = "1";

      await productInteractor.delete(productId);

      expect(mockProductRepository.deleteProduct).toHaveBeenCalledWith(
        productId
      );
    });
  });
});
