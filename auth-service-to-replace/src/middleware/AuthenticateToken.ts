import { Request, Response, NextFunction } from "express";
import AuthInteractor from "../interactors/AuthInteractor";
import { DecodedToken } from "../providers/JwtProvider";
import { RefreshTokenAttributes } from "../repositories/RefreshTokenRepository";

export interface AuthenticatedRequest extends Request {
  accessToken?: string;
  user: { id: string; username: string };
}

class AuthMiddleware {
  private authInteractor: AuthInteractor;
  private decodedAccessToken!: DecodedToken;
  private refreshTokenDBobject!: RefreshTokenAttributes;

  constructor(authInteractor: AuthInteractor) {
    this.authInteractor = authInteractor;
  }

  async authenticateToken(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1];
    console.log("AuthMiddleware: ", accessToken);
    if (!accessToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      this.decodedAccessToken =
        this.authInteractor.decodeAccessToken(accessToken);
      console.log(
        "AuthMiddleware decodedAccessToken: ",
        this.decodedAccessToken
      );
      const refreshTokenDBObject = await this.authInteractor.findRefreshToken(
        this.decodedAccessToken.id
      );
      this.refreshTokenDBobject = refreshTokenDBObject[0];
      console.log("AuthMiddleware refreshTokenDB: ", this.refreshTokenDBobject);
      if (!this.refreshTokenDBobject) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      this.authInteractor.verifyAccessToken(accessToken);

      req.user = {
        id: this.decodedAccessToken.id,
        username: this.decodedAccessToken.username,
      };

      return next();
    } catch (err: any) {
      if (err.name === "TokenExpiredError") {
        console.log("expiration date", this.refreshTokenDBobject.expires);
        if (!this.refreshTokenDBobject) {
          return res.status(401).json({ message: "Unauthorized" });
        }

        const newAccessToken = this.authInteractor.generateAccessToken({
          id: this.decodedAccessToken.id,
          username: this.decodedAccessToken.username,
        });

        req.accessToken = newAccessToken;
        req.user = {
          id: this.decodedAccessToken.id,
          username: this.decodedAccessToken.username,
        };

        return next();
      } else {
        console.log("AuthMiddleware error: ", err);
        return res.status(403).json({ message: "Invalid access token" });
      }
    }
  }
}

export default AuthMiddleware;
