import express from "express";
import mongoose from "mongoose";
import envConfigs from "./config/env.config";
import ExpressAdapter from "./adapters/ExpressAdapter";
import AuthInteractor from "./interactors/AuthInteractor";
import UserInteractor from "./interactors/UserInteractor";

const MONGO_URI = `mongodb+srv://${envConfigs.DB_USER}:${envConfigs.DB_USER_PASSWORD}@${envConfigs.CLUSTER}.${envConfigs.DB_CLOUD_URL}/${envConfigs.DB}?retryWrites=true&w=majority`;
console.log(MONGO_URI);
mongoose.connect(MONGO_URI).catch((error) => {
  console.log("ERROR Connecting to mongo db: ", error);
});
const userInteractor = new UserInteractor();
const authInteractor = new AuthInteractor();

const expressAdapter = new ExpressAdapter(userInteractor, authInteractor);

const app = express();
const port = 3000;

expressAdapter.initConfigs(app);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
