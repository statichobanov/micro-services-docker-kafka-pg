import pgPool from "../providers/pgPoolProvider";

import RefreshTokenEntity from "../entities/RefreshTokenEntity";
import { QueryResult } from "pg";

export interface RefreshTokenAttributes {
  token: string;
  userId: string;
  expires?: Date;
}

class RefreshTokenRepository {
  async upsertRefreshToken(token: RefreshTokenEntity): Promise<void> {
    const pgClient = await pgPool.connect();

    try {
      await pgClient.query("BEGIN");

      const upsertQ = `INSERT INTO public."refresh_token" (id_user, token, expires)
      VALUES ($1, $2, $3)
      ON CONFLICT (id_user)
      DO UPDATE
      SET id_user = $1, token = $2, expires = $3
      returning *`;

      await pgClient.query(upsertQ, [
        token.id_user,
        token.token,
        token.expires,
      ]);

      await pgClient.query("COMMIT");
    } catch (error) {
      await pgClient.query("ROLLBACK");

      throw error;
    } finally {
      await pgClient.release();
    }
  }

  async deleteRefreshToken(userId: string): Promise<void> {
    const pgClient = await pgPool.connect();

    try {
      await pgClient.query("BEGIN");

      const deleteQ = `Delete from "refresh_token"
        where id_user = $1`;

      const dbResult: QueryResult = await pgClient.query(deleteQ, [userId]);

      await pgClient.query("COMMIT");
    } catch (error) {
      await pgClient.query("ROLLBACK");

      throw error;
    } finally {
      await pgClient.release();
    }
  }

  async findRefreshToken(userId: string): Promise<RefreshTokenEntity | null> {
    const pgClient = await pgPool.connect();

    try {
      await pgClient.query("BEGIN");

      const selectQ = `Select * from "refresh_token"
        where id_user = $1`;

      const dbResult: QueryResult = await pgClient.query(selectQ, [userId]);

      await pgClient.query("COMMIT");

      if (dbResult.rowCount) {
        const dbRow = dbResult.rows[0];

        const token: RefreshTokenEntity = new RefreshTokenEntity(
          dbRow.id_user,
          dbRow.token,
          dbRow.expires,
          dbRow.id
        );

        return token;
      } else {
        return null;
      }
    } catch (error) {
      await pgClient.query("ROLLBACK");

      throw error;
    } finally {
      await pgClient.release();
    }
  }
}

export default RefreshTokenRepository;
