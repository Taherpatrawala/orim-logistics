import bookingController from "../controllers/booking.js";
import { Router } from "express";
import authoriseDriver from "../middlewares/authoriseDriver.js";

const bookingRoutes = Router();

bookingRoutes
  .route("/getPendingBookings")
  .get(authoriseDriver, bookingController.getPendingBookings);
bookingRoutes
  .route("/acceptBooking")
  .post(authoriseDriver, bookingController.acceptBooking);

bookingRoutes
  .route("/details/:bookingId")
  .get(authoriseDriver, bookingController.getBookingDetails);

bookingRoutes
  .route("/getAcceptedBookings")
  .get(authoriseDriver, bookingController.acceptedBookings);

bookingRoutes
  .route("/getBookingId")
  .get(authoriseDriver, bookingController.getBookingId);

export default bookingRoutes;
