import authController from "../controllers/auth.js";
import { Router } from "express";

const authRoutes = Router();

authRoutes.route("/signup").post(authController.signup);

authRoutes.route("/login").post(authController.signin);

export default authRoutes;
