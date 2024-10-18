import Booking from "../../../models/bookings.js";

const bookingController = {};

// Create a Booking
bookingController.book = async (req, res) => {
  const {
    driverId,
    pickupLocation,
    dropOffLocation,
    estimatedPrice,
    pickupCoordinates,
    dropOffCoordinates,
  } = req.body;
  const userId = req.user.userId;
  try {
    // Create a new booking
    const booking = new Booking({
      userId,
      driverId,
      pickupLocation,
      dropOffLocation,
      pickupCoordinates: { type: "Point", coordinates: pickupCoordinates },
      dropOffCoordinates: { type: "Point", coordinates: dropOffCoordinates },
      estimatedPrice,
      status: "Pending",
    });

    // Save booking to database
    await booking.save();

    // Logic to notify the driver can be added here (e.g., via WebSockets or a push notification service).

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

bookingController.getAllBookings = async (req, res) => {
  const { userId, userType } = req.user;

  try {
    const bookings = await Booking.find({ userId });
    if (bookings.length === 0) {
      return res
        .status(404)
        .json({ message: "No bookings found for this user." });
    }

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

export default bookingController;
