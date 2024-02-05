import express from "express";
import mongoose from "mongoose";
import envConfigs from "./config/env.config";
import ExpressAdapter from "./adapters/ExpressAdapter";
import AuthInteractor from "./interactors/AuthInteractor";
import UserInteractor from "./interactors/UserInteractor";
import KafkaProducer from "./providers/KafkaProvider";

async function startServer(): Promise<void> {
  try {
    const MONGO_URI = `mongodb+srv://${envConfigs.DB_USER}:${envConfigs.DB_USER_PASSWORD}@${envConfigs.CLUSTER}.${envConfigs.DB_CLOUD_URL}/${envConfigs.DB}?retryWrites=true&w=majority`;

    mongoose.connect(MONGO_URI).catch((error) => {
      console.log("ERROR Connecting to mongo db: ", error);
    });

    const userInteractor = new UserInteractor();
    const authInteractor = new AuthInteractor();
    const kafkaProducer = new KafkaProducer();

    await kafkaProducer.connect();

    const expressAdapter = new ExpressAdapter(
      userInteractor,
      authInteractor,
      kafkaProducer
    );

    const app = express();
    const port = 3001;

    expressAdapter.initConfigs(app);

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
