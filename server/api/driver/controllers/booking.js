import Booking from "../../../models/bookings.js";

const bookingController = {};

// Existing book method
bookingController.book = async (req, res) => {
  const {
    userId,
    driverId,
    pickupLocation,
    dropOffLocation,
    estimatedPrice,
    pickupCoordinates,
    dropOffCoordinates,
  } = req.body;

  try {
    const booking = new Booking({
      userId,
      driverId,
      pickupLocation,
      dropOffLocation,
      pickupCoordinates,
      dropOffCoordinates,
      estimatedPrice,
      status: "Pending",
    });

    await booking.save();
    res.status(201).json({
      message: "Booking created successfully!",
      bookingId: booking._id,
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error in creating booking", error: error.message });
  }
};

// Get all bookings for drivers (status: Pending)
bookingController.getPendingBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ status: "Pending" });
    res.status(200).json({ bookings });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error in fetching bookings", error: error.message });
  }
};

bookingController.getBookingDetails = async (req, res) => {
  const { bookingId } = req.params;

  try {
    const booking = await Booking.findById(bookingId)
      .populate("userId")
      .populate("driverId");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    res.status(200).json({ booking });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching booking details",
      error: error.message,
    });
  }
};

// Driver accepts a booking (updates status to 'Accepted')
bookingController.acceptBooking = async (req, res) => {
  const { bookingId } = req.body;
  const driverId = req.driver.userId;

  try {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    // if (booking.driverId !== driverId) {
    //   return res
    //     .status(403)
    //     .json({ message: "Unauthorized action for this driver." });
    // }

    booking.status = "Accepted";
    booking.driverId = driverId;
    await booking.save();

    res.status(200).json({ message: "Booking accepted successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error in accepting booking", error: error.message });
  }
};

bookingController.acceptedBookings = async (req, res) => {
  const driverId = req.driver.userId;

  try {
    const bookings = await Booking.find({ driverId, status: "Accepted" });

    res.status(200).json({ bookings });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error in fetching accepted bookings", error: error });
  }
};

bookingController.getBookingId = async (req, res) => {
  const driverId = req.driver.userId;

  try {
    const booking = await Booking.findOne({ driverId });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    res.status(200).json({ booking });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error in fetching booking details", error: error });
  }
};

export default bookingController;
