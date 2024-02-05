import express, { Express } from "express";
import initPassport from "../config/passportConfig";
import AuthMiddleware from "../middleware/AuthenticateToken";
import AuthController, {
  AuthenticatedRequest,
} from "../controllers/AuthController";
import AuthInteractor from "../interactors/AuthInteractor";
import UserInteractor from "../interactors/UserInteractor";
import KafkaProducer from "../providers/KafkaProvider";

class ExpressAdapter {
  private authController: AuthController;
  private authMiddleware: AuthMiddleware;

  constructor(
    userInteractor: UserInteractor,
    authInteractor: AuthInteractor,
    kafkaProducer: KafkaProducer
  ) {
    this.authController = new AuthController(
      userInteractor,
      authInteractor,
      kafkaProducer
    );
    this.authMiddleware = new AuthMiddleware(authInteractor);

    /* Initialize Passport local strategy config */
    initPassport();
  }

  initConfigs(app: Express): void {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.post("/authentication/register", (req, res) =>
      this.authController.register(req, res)
    );
    app.post("/authentication/login", (req, res, next) =>
      this.authController.login(req, res, next)
    );

    app.get(
      "/authentication/protected",
      this.authMiddleware.authenticateToken.bind(this.authMiddleware) as any,
      (req, res, next) => {
        this.authController.protected(req as AuthenticatedRequest, res);
      }
    );

    app.post(
      "/authentication/logout",
      this.authMiddleware.authenticateToken.bind(this.authMiddleware) as any,
      (req, res, next) => {
        this.authController.logout(req as AuthenticatedRequest, res);
      }
    );
  }
}

export default ExpressAdapter;
