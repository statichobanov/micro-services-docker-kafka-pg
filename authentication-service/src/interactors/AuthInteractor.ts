import JwtProvider, { DecodedToken } from "../providers/JwtProvider";
import RefreshTokenRepository, {
  RefreshTokenAttributes,
} from "../repositories/RefreshTokenRepository";
import envConfigs from "../config/env.config";
import { RefreshTokenDocument } from "../entities/RefreshToken";

export interface TokenPayload {
  id: string;
  username: string;
}

class AuthInteractor {
  private refreshTokenRepository: RefreshTokenRepository;
  private jwtProvider: JwtProvider;

  constructor() {
    this.refreshTokenRepository = new RefreshTokenRepository();
    this.jwtProvider = new JwtProvider({
      accessTokenSecret: envConfigs.ACCESS_TOKEN_SECRET,
      refreshTokenSecret: envConfigs.REFRESH_TOKEN_SECRET,
    });
  }

  generateAccessToken({ id, username }: TokenPayload): string {
    console.log("AuthInteractor generateAccessToken", id, username);
    return this.jwtProvider.generateAccessToken(
      { id, username },
      { expiresIn: "1h" }
    );
  }

  generateRefreshToken({ id, username }: TokenPayload): string {
    console.log("AuthInteractor generateRefreshToken", id, username);
    return this.jwtProvider.generateRefreshToken(
      { id, username },
      { expiresIn: "1d" }
    );
  }

  decodeAccessToken(token: string): DecodedToken {
    return this.jwtProvider.verifyToken(
      token,
      process.env.ACCESS_TOKEN_SECRET as string,
      { ignoreExpiration: true }
    );
  }

  verifyAccessToken(token: string): DecodedToken {
    return this.jwtProvider.verifyToken(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    );
  }

  verifyRefreshToken(token: string): DecodedToken {
    return this.jwtProvider.verifyToken(
      token,
      process.env.REFRESH_TOKEN_SECRET as string
    );
  }

  async saveRefreshToken(
    refreshTokenObject: RefreshTokenAttributes
  ): Promise<void> {
    await this.refreshTokenRepository.saveRefreshToken(refreshTokenObject);
  }

  async findRefreshToken(userId: string): Promise<RefreshTokenAttributes[]> {
    return await this.refreshTokenRepository.findRefreshToken(userId);
  }

  async deleteAllRefreshTokens({ userId }: { userId: string }): Promise<void> {
    await this.refreshTokenRepository.deleteAllRefreshTokens({
      userId: userId,
    });
  }
}

export default AuthInteractor;
