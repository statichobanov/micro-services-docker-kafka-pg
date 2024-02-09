import express from "express";

import ExpressAdapter from "./adapters/ExpressAdapter";
import KafkaConsumer from "./services/KafkaConsumer";

const app = express();
const port = 3002;

async function startConsumers(): Promise<void> {
  const kafkaConsumer = new KafkaConsumer();
  await kafkaConsumer.connect();
  await kafkaConsumer.subscribe("product-quantity-add");
  await kafkaConsumer.subscribe("product-quantity-remove");

  console.log(
    "Subscribed to topics: product-quantity-add, product-quantity-remove"
  );

  await kafkaConsumer.run();
}

async function startServer(): Promise<void> {
  const expressAdapter = new ExpressAdapter();

  expressAdapter.initConfigs(app);

  try {
    await startConsumers();

    app.listen(port, () => {
      console.log(`Product catalog listening at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error starting consumers:", error);
    process.exit(1);
  }
}

startServer();
