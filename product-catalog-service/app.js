const express = require("express");
const { Kafka } = require("kafkajs");

const app = express();
const port = 3002;

const kafka = new Kafka({
  clientId: "product-catalog-service",
  brokers: ["kafka:9092"],
});

const consumer = kafka.consumer({ groupId: "product-catalog-group" });

const handleUserLoggedInEvent = async ({ message }) => {
  const { userId, username } = JSON.parse(message.value);

  console.log(
    `User ${username} (ID: ${userId}) logged in. Updating product catalog.`
  );
};

const run = async () => {
  await consumer.connect();

  console.log("Consumer Connected successfully");

  await consumer.subscribe({ topic: "user-events", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      switch (topic) {
        case "user-events":
          await handleUserLoggedInEvent({ message });
          break;
        // Add more cases for other event types if needed
      }
    },
  });
};

app.post("/product-catalog/list", async (req, res) => {
  console.log("Welcome to catalog-list endpoint");

  res.status(200).json({ message: "Product catalog list success" });
});

app.listen(port, () => {
  console.log(`Authentication Service listening at http://localhost:${port}`);
});

run().catch(console.error);
