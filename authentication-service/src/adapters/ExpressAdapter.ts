import express, { Express } from "express";

import AuthController from "../controllers/AuthController";
import AuthInteractor from "../interactors/AuthInteractor";
import UserInteractor from "../interactors/UserInteractor";

class ExpressAdapter {
  private authController: AuthController;

  constructor() {
    const userInteractor = new UserInteractor();
    const authInteractor = new AuthInteractor();

    this.authController = new AuthController(userInteractor, authInteractor);
  }

  initConfigs(app: Express): void {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.post("/authentication/login", (req, res, next) =>
      this.authController.login(req, res, next)
    );

    app.get("/authentication/logout", (req, res) => {
      console.log("HIT adatapter logout:");
      this.authController.logout(req, res);
    });

    app.post("/authentication/register", (req, res) =>
      this.authController.register(req, res)
    );

    app.get("/authentication/get-all-users", (req, res) =>
      this.authController.getAllUsers(req, res)
    );
  }
}

export default ExpressAdapter;
