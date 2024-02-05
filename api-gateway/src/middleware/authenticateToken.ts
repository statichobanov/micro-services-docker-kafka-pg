// api-gateway/authMiddleware.ts

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authorizationPaths = ["/authentication/logout"];

function authenticateToken(req: Request, res: Response, next: NextFunction) {
  console.log(req.path);
  /* if (authorizationPaths.includes(req.path)) {
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1];

    if (!accessToken) {
      return res.status(401).json({ message: "Missing Token" });
    }

    jwt.verify(accessToken, "secret", (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid access token" });
      }

      // Attach user information to the request for further processing
      (req as any).user = user;
      next();
    });
  } else { */
  // Skip token validation for other routes
  next();
}

export default authenticateToken;
