import AdminJS from "adminjs";
import * as AdminJSMongoose from "@adminjs/mongoose";
import { dark, light } from "@adminjs/themes";
import { buildRouter, buildAuthenticatedRouter } from "@adminjs/express";
import connectDB from "./config/mongooseConnect.js"; // Import your existing DB connection function
import mongoose from "mongoose";
import { DefaultAuthProvider } from "adminjs";
import { ComponentLoader } from "adminjs";
import Driver from "./models/driver.js";
import User from "./models/customers.js";
import Booking from "./models/bookings.js";
import Vehicle from "./models/vehicles.js";
// Register AdminJS Mongoose adapter
AdminJS.registerAdapter(AdminJSMongoose);

const authenticate = ({ email, password }, ctx) => {
  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    return { email };
  } else return null;
};

const componentLoader = new ComponentLoader();
const authProvider = new DefaultAuthProvider({
  componentLoader,
  authenticate,
});

const adminJs = new AdminJS({
  componentLoader,
  resources: [
    {
      resource: User,
    },
    {
      resource: Driver,
    },
    {
      resource: Booking,
    },
    {
      resource: Vehicle,
    },
  ],
  rootPath: "/admin",
  defaultTheme: light.id,
  availableThemes: [dark, light],
  branding: {
    companyName: "Orim Logistics",
    softwareBrothers: false,
    logo: "/logo.svg", // Update if necessary
  },
});

// Build the AdminJS router
const router = buildAuthenticatedRouter(
  adminJs,
  {
    cookiePassword: "test",
    provider: authProvider,
  },
  null,
  {
    secret: "test",
    resave: false,
    saveUninitialized: true,
  }
);
// app.use(adminJs.options.rootPath, router)

adminJs.watch();

// Function to configure AdminJS in your app
const adminJSConfig = (app) => {
  app.use(adminJs.options.rootPath, router);
};

export default adminJSConfig;
