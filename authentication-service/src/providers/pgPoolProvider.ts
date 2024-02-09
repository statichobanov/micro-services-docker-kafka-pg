import { Pool } from "pg";

const pgConString = {
  user: "postgres",
  password: "postgres",
  host: "postgres",
  port: 5432,
  database: "yara_assignment",
};

const pgPool: Pool = new Pool(pgConString);

export default pgPool;
