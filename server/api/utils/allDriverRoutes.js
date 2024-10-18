import authRoutes from "../driver/routes/auth.js";
import bookingRoutes from "../driver/routes/booking.js";

const ALL_DRIVER_ROUTES = (app) => {
  app.use("/api/driver", authRoutes);

  app.use("/api/driver/booking", bookingRoutes);
};

export default ALL_DRIVER_ROUTES;
