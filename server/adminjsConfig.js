import AdminJS from "adminjs";
import * as AdminJSMongoose from "@adminjs/mongoose";
import { dark, light } from "@adminjs/themes";
import { buildRouter } from "@adminjs/express";
import connectDB from "./config/mongooseConnect.js"; // Import your existing DB connection function
import mongoose from "mongoose";
import Driver from "./models/driver.js";
import User from "./models/customers.js";
import Booking from "./models/bookings.js";
import Vehicle from "./models/vehicles.js";
// Register AdminJS Mongoose adapter
AdminJS.registerAdapter(AdminJSMongoose);

const adminJs = new AdminJS({
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
    companyName: "Atlan Logistics",
    softwareBrothers: false,
    // logo: '/path-to-your-logo.png', // Update if necessary
  },
});

// Build the AdminJS router
const router = buildRouter(adminJs);

// Function to configure AdminJS in your app
const adminJSConfig = (app) => {
  app.use(adminJs.options.rootPath, router);
};

export default adminJSConfig;
