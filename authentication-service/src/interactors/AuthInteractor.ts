import JwtProvider from "../providers/JwtProvider";
import RefreshTokenRepository from "../repositories/RefreshTokenRepository";
import envConfigs from "../config/env.config";
import RefreshTokenEntity from "../entities/RefreshTokenEntity";
import UserEntity from "../entities/UserEntity";
import { JwtPayload } from "jsonwebtoken";
import UserRepository from "../repositories/UserRepository";

export interface TokenPayload {
  id: string;
  username: string;
}

class AuthInteractor {
  private refreshTokenRepository: RefreshTokenRepository;
  private jwtProvider: JwtProvider;
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.refreshTokenRepository = new RefreshTokenRepository();

    this.jwtProvider = new JwtProvider({
      accessTokenSecret: envConfigs.ACCESS_TOKEN_SECRET,
      refreshTokenSecret: envConfigs.REFRESH_TOKEN_SECRET,
    });
  }

  async findRefreshToken(userId: string): Promise<RefreshTokenEntity | null> {
    return await this.refreshTokenRepository.findRefreshToken(userId);
  }

  generateAccessToken(user: UserEntity): RefreshTokenEntity {
    const tokenString: string = this.jwtProvider.generateAccessToken(user);

    const expires: Date = new Date(Date.now() + 60 * 60 * 1000); /* One hour */

    const token: RefreshTokenEntity = new RefreshTokenEntity(
      user.id,
      tokenString,
      expires
    );

    return token;
  }

  generateRefreshToken(user: UserEntity): RefreshTokenEntity {
    const tokenString: string = this.jwtProvider.generateRefreshToken(user);

    const expires: Date = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    ); /* One day */

    const token: RefreshTokenEntity = new RefreshTokenEntity(
      user.id,
      tokenString,
      expires
    );

    return token;
  }

  async upsertRefreshToken(token: RefreshTokenEntity): Promise<void> {
    await this.refreshTokenRepository.upsertRefreshToken(token);
  }

  async deleteRefreshToken(userId: string): Promise<void> {
    await this.refreshTokenRepository.deleteRefreshToken(userId);
  }

  decodeAccessToken(tokenStr: string): JwtPayload {
    const token: JwtPayload = this.jwtProvider.verifyToken(
      tokenStr,
      envConfigs.ACCESS_TOKEN_SECRET,
      { ignoreExpiration: true }
    );

    return token;
  }

  async login(username: string, password: string): Promise<UserEntity | null> {
    try {
      const user = await this.userRepository.findUserByUsername(username);

      if (
        !user ||
        !(await this.userRepository.isValidPassword(password, user.password))
      ) {
        return null;
      }

      return user;
    } catch (error) {
      throw error;
    }
  }
}

export default AuthInteractor;
