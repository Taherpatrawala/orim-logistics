import authRoutes from "../driver/routes/auth.js";
import bookingRoutes from "../driver/routes/booking.js";
import profileRoutes from "../driver/routes/profile.js";
const ALL_DRIVER_ROUTES = (app) => {
  app.use("/api/driver", authRoutes);

  app.use("/api/driver/booking", bookingRoutes);

  app.use("/api/driver", profileRoutes);
};

export default ALL_DRIVER_ROUTES;
