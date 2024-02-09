import { Kafka, Producer } from "kafkajs";

class KafkaProducer {
  private producer: Producer;

  constructor() {
    const kafka = new Kafka({
      clientId: "order-service-producer",
      brokers: ["kafka:9092"],
    });

    this.producer = kafka.producer();
  }

  async connect(): Promise<void> {
    try {
      await this.producer.connect();
      console.log("Kafka Producer connected");
    } catch (error) {
      console.error("Kafka Producer connection error:", error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.producer.disconnect();
      console.log("Kafka Producer disconnected");
    } catch (error) {
      console.error("Error disconnecting Kafka Producer:", error);
      throw error;
    }
  }

  async sendMessage(topic: string, value: string): Promise<void> {
    try {
      const record = { topic, messages: [{ value }] };
      console.log("record", record);
      await this.producer.send(record);
      console.log("Message sent successfully");
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }
}

export default KafkaProducer;
