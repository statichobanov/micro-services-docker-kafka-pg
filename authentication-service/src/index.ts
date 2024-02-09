import express from "express";
import ExpressAdapter from "./adapters/ExpressAdapter";

async function startServer(): Promise<void> {
  try {
    const expressAdapter = new ExpressAdapter();

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
