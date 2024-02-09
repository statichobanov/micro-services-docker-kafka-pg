import pg from "pg";

const Pool = pg.Pool;

const pgConString = {
  user: "postgres",
  password: "postgres",
  host: "postgres",
  port: 5432,
  database: "yara_assignment",
};

const pgPool = new Pool(pgConString);

export default pgPool;
