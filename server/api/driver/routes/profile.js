import { Router } from "express";
import driverProfileController from "../controllers/profile.js";
import authorizeDriver from "../middlewares/authoriseDriver.js";

const profileRoutes = Router();

profileRoutes
  .route("/profile")
  .get(authorizeDriver, driverProfileController.getProfileData);

export default profileRoutes;
