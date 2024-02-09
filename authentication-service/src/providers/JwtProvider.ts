import jwt, { SignOptions, VerifyOptions, JwtPayload } from "jsonwebtoken";
import UserEntity from "../entities/UserEntity";

export interface TokenPayload {
  id: string;
  username: string;
}

export interface DecodedToken {
  id: string;
  username: string;
  exp: number;
}

export interface JwtProviderOptions {
  accessTokenSecret: string;
  refreshTokenSecret: string;
}

class JwtProvider {
  private accessTokenSecret: string;
  private refreshTokenSecret: string;

  constructor(options: JwtProviderOptions) {
    this.accessTokenSecret = options.accessTokenSecret;
    this.refreshTokenSecret = options.refreshTokenSecret;
  }

  generateAccessToken(user: UserEntity): string {
    return jwt.sign({ userId: user.id }, this.accessTokenSecret, {
      expiresIn: "1h",
    });
  }

  generateRefreshToken(user: UserEntity): string {
    return jwt.sign({ userId: user.id }, this.refreshTokenSecret, {
      expiresIn: "1d",
    });
  }

  verifyToken(
    token: string,
    secret: string,
    options?: VerifyOptions
  ): JwtPayload {
    return jwt.verify(token, secret, options) as JwtPayload;
  }
}

export default JwtProvider;
