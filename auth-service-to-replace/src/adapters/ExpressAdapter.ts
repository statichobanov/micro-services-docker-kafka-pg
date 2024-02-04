import express, { Express } from "express";
import initPassport from "../config/passportConfig";
import AuthMiddleware from "../middleware/AuthenticateToken";
import AuthController, {
  AuthenticatedRequest,
} from "../controllers/AuthController";
import AuthInteractor from "../interactors/AuthInteractor";
import UserInteractor from "../interactors/UserInteractor";

class ExpressAdapter {
  private authController: AuthController;
  private authMiddleware: AuthMiddleware;

  constructor(userInteractor: UserInteractor, authInteractor: AuthInteractor) {
    this.authController = new AuthController(userInteractor, authInteractor);
    this.authMiddleware = new AuthMiddleware(authInteractor);

    /* Initialize Passport local strategy config */
    initPassport();
  }

  initConfigs(app: Express): void {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.post("/register", (req, res) => this.authController.register(req, res));
    app.post("/login", (req, res, next) =>
      this.authController.login(req, res, next)
    );

    app.get(
      "/protected",
      this.authMiddleware.authenticateToken.bind(this.authMiddleware) as any,
      (req, res, next) => {
        this.authController.protected(req as AuthenticatedRequest, res);
      }
    );

    app.post(
      "/logout",
      this.authMiddleware.authenticateToken.bind(this.authMiddleware) as any,
      (req, res, next) => {
        this.authController.logout(req as AuthenticatedRequest, res);
      }
    );
  }
}

export default ExpressAdapter;
