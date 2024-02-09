import jwt, { JwtPayload, VerifyOptions } from "jsonwebtoken";

class JwtProvider {
  constructor() {}

  verifyToken(
    token: string,
    secret: string,
    options?: VerifyOptions
  ): JwtPayload {
    return jwt.verify(token, secret, options) as JwtPayload;
  }
}

export default JwtProvider;
