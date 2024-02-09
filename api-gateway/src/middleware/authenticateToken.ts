import { Request, Response, NextFunction } from "express";
import JwtProvider from "../providers/JwtProvider.js";
import envConfig from "../config/env.config.js";
import getUserRefreshToken from "../util/getUserRefreshToken.js";

const authorizationPaths = [
  "/logout",
  "/create",
  "/delete",
  "/update",
  "/status-update",
  "/get-all-users",
];

async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("req.path", req.path);

  if (authorizationPaths.includes(req.path)) {
    try {
      const jwtProvider = new JwtProvider();
      const accessToken = extractAccessToken(req);

      if (!accessToken) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const decoded = jwtProvider.verifyToken(
        accessToken,
        envConfig.ACCESS_TOKEN_SECRET
      );

      const userId = decoded.userId;

      if (!(await getUserRefreshToken(userId))) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      next();
    } catch (error: any) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } else {
    next();
  }
}

function extractAccessToken(req: Request): string | undefined {
  const authHeader = req.headers["authorization"];
  return authHeader && authHeader.split(" ")[1];
}

export default authenticateToken;
