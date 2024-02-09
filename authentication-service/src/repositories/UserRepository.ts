import { PoolClient } from "pg";
import bcrypt from "bcrypt";

import pgPool from "../providers/pgPoolProvider";
import UserEntity from "../entities/UserEntity";
import { UserPayload } from "../entities/UserPayload";

class UserRepository {
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  }

  async isValidPassword(
    password: string,
    dbPassword: string
  ): Promise<boolean> {
    try {
      return await bcrypt.compare(password, dbPassword);
    } catch (error) {
      throw error;
    }
  }

  async createUser(userPayload: UserPayload): Promise<UserEntity> {
    const pgClient: PoolClient = await pgPool.connect();

    try {
      const hashedPassword: string = await this.hashPassword(
        userPayload.password
      );

      await pgClient.query("BEGIN");

      const insertQ: string = `INSERT INTO public."user" (username, password, first_name, last_name)
        values ($1, $2, $3, $4)
        returning *`;

      const userCreated: UserEntity = (
        await pgClient.query(insertQ, [
          userPayload.username,
          hashedPassword,
          userPayload.first_name,
          userPayload.last_name,
        ])
      ).rows[0] as UserEntity;

      await pgClient.query("COMMIT");

      return userCreated;
    } catch (error) {
      await pgClient.query("ROLLBACK");

      throw error;
    } finally {
      await pgClient.release();
    }
  }

  async getAll(): Promise<UserEntity[]> {
    const pgClient = await pgPool.connect();

    try {
      await pgClient.query("BEGIN");

      const selectQ = `Select * from "user"`;

      const users = (await pgClient.query(selectQ)).rows as UserEntity[];

      await pgClient.query("COMMIT");

      return users;
    } catch (error) {
      await pgClient.query("ROLLBACK");

      throw error;
    } finally {
      await pgClient.release();
    }
  }

  async findUserByUsername(username: string): Promise<UserEntity | null> {
    const pgClient = await pgPool.connect();

    try {
      await pgClient.query("BEGIN");

      const selectQ = `Select * from "user"
          where username = $1`;

      const dbUser = (await pgClient.query(selectQ, [username])).rows[0];

      await pgClient.query("COMMIT");

      if (dbUser) {
        const user: UserEntity = new UserEntity(
          dbUser.id,
          dbUser.username,
          dbUser.password,
          dbUser.first_name,
          dbUser.last_name
        );

        return user;
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

export default UserRepository;
