import authRoutes from "../customer/routes/auth.js";
import bookingRoutes from "../customer/routes/booking.js";
const ALL_CUSTOMER_ROUTES = (app) => {
  app.use("/api/customer", authRoutes);
  app.use("/api/customer/book", bookingRoutes);
};

export default ALL_CUSTOMER_ROUTES;
