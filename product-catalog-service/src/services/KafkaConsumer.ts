import { Kafka, Consumer, KafkaMessage } from "kafkajs";
import ProductInteractor from "../interactors/ProductInteractor";
import OrderProductsEntity from "../entities/OrderProductsEntity";

class KafkaConsumer {
  private consumer: Consumer;
  private productInteractor: ProductInteractor;

  constructor() {
    const kafka = new Kafka({
      clientId: "product-catalog-service-consumer",
      brokers: ["kafka:9092"],
    });

    this.consumer = kafka.consumer({ groupId: "product-catalog-group" });

    this.productInteractor = new ProductInteractor();
  }

  async connect(): Promise<void> {
    try {
      await this.consumer.connect();
      console.log("Kafka Consumer connected");
    } catch (error) {
      console.error("Kafka Consumer connection error:", error);
      throw error;
    }
  }

  async subscribe(topic: string): Promise<void> {
    await this.consumer.subscribe({ topic });
  }

  async run(): Promise<void> {
    await this.consumer.run({
      eachMessage: async ({ topic, message }) =>
        await this.handleMessage(topic, message),
    });
    console.log("Kafka Consumer started running");
  }

  private async handleMessage(
    topic: string,
    message: KafkaMessage
  ): Promise<void> {
    if (message && message.value) {
      const payload = message.value.toString();

      switch (topic) {
        case "product-quantity-add":
          const productsAdd: OrderProductsEntity[] = JSON.parse(payload);
          await this.productInteractor.addQuantities(productsAdd);

          break;
        case "product-quantity-remove":
          try {
            const productsDel: OrderProductsEntity[] = JSON.parse(payload);
            await this.productInteractor.removeQuantities(productsDel);

            break;
          } catch (error) {
            console.log("Error:", error);
          } finally {
            break;
          }
        default:
          console.warn(`Received message for unknown topic: ${topic}`);
      }
    } else {
      console.log("Missing message or message value");
    }
  }
}

export default KafkaConsumer;
