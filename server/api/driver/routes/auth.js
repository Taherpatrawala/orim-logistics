import express from "express";
import driverController from "../controllers/auth.js";

const driverRoutes = express.Router();

driverRoutes.post("/signup", driverController.signup);
driverRoutes.post("/login", driverController.signin);

export default driverRoutes;
