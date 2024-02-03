import express, { Request, Response } from "express";
import { Kafka, Producer, ProducerRecord } from "kafkajs";

const app = express();
const port = 3004;
let producer: Producer;

// ... Other authentication logic ...

const kafka = new Kafka({
  clientId: "order-service",
  brokers: ["kafka:9092"],
});

producer = kafka.producer();

console.log("Producer connected");

app.get("/order/create", async (req: Request, res: Response) => {
  console.log("Order create route hit");

  const message: ProducerRecord = {
    topic: "order-events",
    messages: [
      {
        value: JSON.stringify({
          eventType: "NewOrder",
          userId: "user.id",
          username: "user.username",
        }),
      },
    ],
  };

  await producer.send(message);

  res.status(200).json({ message: "Login successful" });
});

app.listen(port, () => {
  console.log(`Authentication Service listening at http://localhost:${port}`);
});

producer
  .connect()
  .then(() => console.log("Producer connected"))
  .catch((error) => console.error("Producer connection error:", error));
