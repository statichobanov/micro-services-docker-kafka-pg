import OrderProductsEntity from "../entities/OrderProductsEntity";
import ProductEntity from "../entities/ProductEntity";
import { ProductPayload } from "../entities/ProductPayload";
import ProductRepository from "../repositories/ProductRepository";

class ProductInteractor {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  async create(product: ProductPayload): Promise<ProductEntity> {
    return await this.productRepository.createProduct(product);
  }

  async update(productPayload: ProductPayload): Promise<ProductEntity> {
    return await this.productRepository.updateProduct(productPayload);
  }

  async addQuantities(products: OrderProductsEntity[]): Promise<void> {
    for (let index = 0; index < products.length; index++) {
      const product = products[index];

      await this.productRepository.addQuantity(product);
    }
  }

  async removeQuantities(products: OrderProductsEntity[]): Promise<void> {
    for (let index = 0; index < products.length; index++) {
      const product = products[index];

      console.log("product", product);

      await this.productRepository.removeQuantity(product);
    }
  }

  async delete(productId: string): Promise<void> {
    await this.productRepository.deleteProduct(productId);
  }
}

export default ProductInteractor;
