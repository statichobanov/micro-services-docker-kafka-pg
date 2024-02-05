import { Kafka, Producer, ProducerRecord } from "kafkajs";

class KafkaProducer {
  private producer: Producer;

  constructor() {
    const kafka = new Kafka({
      clientId: "authentication-service",
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

  async sendMessage(record: ProducerRecord): Promise<void> {
    await this.producer.send(record);
  }
}

export default KafkaProducer;
