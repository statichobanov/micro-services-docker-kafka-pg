const { Client } = require('pg');
const runner = require('node-pg-migrate').default;

async function runMigrations() {
  const dbName = 'yara_assignment'

  const conString = {
    user: "postgres",
    password: "postgres",
    host: "localhost",
    port: "5432",
    database: "postgres"
  }

  let client = new Client(conString);
  try {
    await client.connect();
    await client.query(`create database ${dbName}`);
    await client.end();
  }
  catch (e) {}

  try {
    conString.database = dbName;
    client = new Client(conString);

    await client.connect();

    const migrateOptions = {
      dbClient: client,
      dir: './migrations',
      direction: 'up',
      migrationsTable: 'migrations'
    };

    await runner(migrateOptions);
  } catch (e) {
    console.log(e);
  }

  console.log('END');
  await client.end();
}

runMigrations().then(() => {
  process.exit();
});
