import express from "express";

import KafkaProducer from "./services/KafkaProducer";
import ExpressAdapter from "./adapters/ExpressAdapter";

const app = express();
const port = 3004;

async function startServer(): Promise<void> {
  const kafkaProducer = new KafkaProducer();
  await kafkaProducer.connect();
  const expressAdapter = new ExpressAdapter(kafkaProducer);

  expressAdapter.initConfigs(app);

  app.listen(port, () => {
    console.log(`Authentication Service listening at http://localhost:${port}`);
  });
}

startServer();
