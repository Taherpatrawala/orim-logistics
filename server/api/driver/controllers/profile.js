import ALL_MODELS from "../../utils/allModels.js";

const driverProfileController = {};

driverProfileController.getProfileData = async (req, res) => {
  const driverId = req.driver.userId; // Assuming user ID is stored in the request after authorization

  try {
    // Fetch driver's profile information
    const driverProfile = await ALL_MODELS.DRIVER.findById(driverId).select(
      "name email phone vehicleType licenseNumber"
    );

    if (!driverProfile) {
      return res.status(404).json({ message: "Driver not found." });
    }

    // Fetch driver's booking statistics
    const totalBookings = await ALL_MODELS.BOOKING.countDocuments({ driverId });
    const acceptedBookings = await ALL_MODELS.BOOKING.countDocuments({
      driverId,
      status: "Accepted",
    });
    const earnings = await ALL_MODELS.BOOKING.aggregate([
      { $match: { driverId, status: "Completed" } },
      { $group: { _id: null, totalEarnings: { $sum: "₹chargedAmount" } } },
    ]);

    res.status(200).json({
      ...driverProfile.toObject(),
      totalBookings,
      acceptedBookings,
      earnings: earnings[0]?.totalEarnings || 0,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching driver data.", error: error.message });
  }
};

export default driverProfileController;
