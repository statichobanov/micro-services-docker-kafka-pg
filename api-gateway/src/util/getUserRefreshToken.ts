import pgPool from "../providers/pgPoolProvider.js";

async function getUserRefreshToken(userId: string): Promise<Boolean> {
  const pgClient = await pgPool.connect();

  try {
    await pgClient.query("BEGIN");

    const selectQ = `SELECT EXISTS (SELECT 1 FROM "refresh_token" WHERE id_user = $1);`;

    const dbResult = await pgClient.query(selectQ, [userId]);

    await pgClient.query("COMMIT");

    const dbRow = dbResult.rows[0];

    return dbRow.exists;
  } catch (error) {
    await pgClient.query("ROLLBACK");

    throw error;
  } finally {
    await pgClient.release();
  }
}

export default getUserRefreshToken;
