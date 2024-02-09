import dotenv from "dotenv";
dotenv.config();

type EnvConfigs = Record<string, string>;

const envConfigs: EnvConfigs = {
  CLUSTER: process.env.CLUSTER || "",
  DB: process.env.DB || "",
  DB_USER: process.env.DB_USER || "",
  DB_USER_PASSWORD: process.env.DB_USER_PASSWORD || "",
  DB_CLOUD_URL: process.env.DB_CLOUD_URL || "",
  ACCESS_TOKEN_SECRET:
    process.env.ACCESS_TOKEN_SECRET || "lXy8rvDCmXhNbkYAfRmxJ",
  REFRESH_TOKEN_SECRET:
    process.env.REFRESH_TOKEN_SECRET || "zSbIIfqNQaWprDA8noK2c",
};

export default envConfigs;
