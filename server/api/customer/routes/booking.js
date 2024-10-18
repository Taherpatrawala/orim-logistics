import bookingController from "../controllers/booking.js";
import { Router } from "express";
import authorize from "../middleware/authorize.js";
const bookingRoutes = Router();

bookingRoutes.route("/").post(authorize, bookingController.book);

bookingRoutes
  .route("/getAllBooking")
  .get(authorize, bookingController.getAllBookings);

bookingRoutes
  .route("/details/:bookingId")
  .get(authorize, bookingController.getBookingDetails);
export default bookingRoutes;
