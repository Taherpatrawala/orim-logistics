import User from "../../models/customers.js";
import Driver from "../../models/driver.js";
import Booking from "../../models/bookings.js";
import Vehicle from "../../models/vehicles.js";

const ALL_MODELS = {
  USER: User,
  DRIVER: Driver,
  BOOKING: Booking,
  VEHICLE: Vehicle,
};

export default ALL_MODELS;
