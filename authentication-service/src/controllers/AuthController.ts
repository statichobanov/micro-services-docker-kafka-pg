import { Request, Response, NextFunction } from "express";
import AuthInteractor from "../interactors/AuthInteractor";
import UserInteractor from "../interactors/UserInteractor";

import { UserPayload } from "../entities/UserPayload";
import UserEntity from "../entities/UserEntity";

class AuthController {
  private userInteractor: UserInteractor;
  private authInteractor: AuthInteractor;

  constructor(userInteractor: UserInteractor, authInteractor: AuthInteractor) {
    this.userInteractor = userInteractor;
    this.authInteractor = authInteractor;
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const userPayload: UserPayload = req.body;

      const newUser = await this.userInteractor.register(userPayload);

      res.json(newUser);
    } catch (error: any) {
      console.log("Error Register User:", error);

      switch (error.message) {
        case "Username already taken":
          res.status(404).json({ message: error.message });

          break;

        default:
          res.status(500).json({ message: "Internal server error" });
          break;
      }
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const username: string = req.body.username;
      const password: string = req.body.password;

      const user = await this.authInteractor.login(username, password);

      if (!user) {
        res.status(401).json({ message: "Authentication failed" });
      } else {
        const accessToken = this.authInteractor.generateAccessToken(user);
        const refreshToken = this.authInteractor.generateRefreshToken(user);

        console.log("accessToken", accessToken);
        console.log("refreshToken", refreshToken);

        await this.authInteractor.upsertRefreshToken(refreshToken);

        res.json({ accessToken: accessToken.token });
      }
    } catch (error) {
      console.log("Error: ", error);

      res.status(500).json({ message: "Internal server error" });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    const authHeader = req.headers["authorization"];
    const accessTokenStr = authHeader && authHeader.split(" ")[1];

    const decodeAccessToken = this.authInteractor.decodeAccessToken(
      accessTokenStr || ""
    );

    try {
      await this.authInteractor.deleteRefreshToken(decodeAccessToken.userId);

      res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      console.log("Error During Logout:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users: UserEntity[] = await this.userInteractor.getAll();

      res.status(200).json({ users });
    } catch (error) {
      console.log("Error During Logout:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default AuthController;
