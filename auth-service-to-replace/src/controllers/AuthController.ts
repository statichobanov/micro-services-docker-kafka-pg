import passport from "passport";
import { Request, Response, NextFunction } from "express";
import AuthInteractor from "../interactors/AuthInteractor";
import UserInteractor from "../interactors/UserInteractor";

export interface AuthenticatedRequest extends Request {
  accessToken?: string;
  user: { id: string };
}

class AuthController {
  private userInteractor: UserInteractor;
  private authInteractor: AuthInteractor;

  constructor(userInteractor: UserInteractor, authInteractor: AuthInteractor) {
    this.userInteractor = userInteractor;
    this.authInteractor = authInteractor;
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const newUserPayload = req.body;
      const newUser = await this.userInteractor.register(newUserPayload);

      const accessToken = this.authInteractor.generateAccessToken(newUser);
      const refreshToken = this.authInteractor.generateRefreshToken(newUser);

      await this.authInteractor.saveRefreshToken({
        token: refreshToken,
        userId: newUser.id,
      });

      res.json({ accessToken: accessToken });
    } catch (error) {
      console.log("Error Register User:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    passport.authenticate(
      "local",
      { session: false },
      async (err: any, user: any) => {
        if (err || !user) {
          return res
            .status(401)
            .json({ message: err || "Authentication failed" });
        }
        console.log("AuthController /login: ", user);
        const accessToken = this.authInteractor.generateAccessToken(user);
        const refreshToken = this.authInteractor.generateRefreshToken(user);
        console.log("AuthController /login accessToken: ", accessToken);
        await this.authInteractor.saveRefreshToken({
          userId: user.id,
          token: refreshToken,
        });

        res.json({ accessToken: accessToken });
      }
    )(req, res, next);
  }

  async protected(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const users = await this.userInteractor.findAllUsers();
      if (req.accessToken) {
        res.json({
          accessToken: req.accessToken,
          message: "This is a protected route",
          user: req.user,
          allUsers: users,
        });
      } else {
        res.json({
          message: "This is a protected route",
          user: req.user,
          allUsers: users,
        });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async logout(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      await this.authInteractor.deleteAllRefreshTokens({
        userId: req.user.id,
      });

      res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      console.log("Error During Logout:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default AuthController;
