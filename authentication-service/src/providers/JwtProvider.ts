import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";

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

  generateAccessToken(payload: TokenPayload, options?: SignOptions): string {
    console.log("JwtProvider accessTokenSecret:", this.accessTokenSecret);
    return jwt.sign(payload, this.accessTokenSecret, options);
  }

  generateRefreshToken(payload: TokenPayload, options?: SignOptions): string {
    return jwt.sign(payload, this.refreshTokenSecret, options);
  }

  verifyToken(
    token: string,
    secret: string,
    options?: VerifyOptions
  ): DecodedToken {
    console.log("JwtProvider verifyToken ", `${token}, ${secret} ${options}`);
    return jwt.verify(token, secret, options) as DecodedToken;
  }
}

export default JwtProvider;
