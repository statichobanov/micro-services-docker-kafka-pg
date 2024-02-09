import dotenv from "dotenv";
dotenv.config();

type EnvConfigs = Record<string, string>;

const envConfigs: EnvConfigs = {
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "",
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "",
};

export default envConfigs;
