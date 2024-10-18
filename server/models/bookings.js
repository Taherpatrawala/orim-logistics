import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },
  pickupLocation: String,
  dropOffLocation: String,
  pickupCoordinates: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: [Number],
  },
  dropOffCoordinates: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: [Number],
  },
  status: {
    type: String,
    enum: [
      "Pending",
      "Accepted",
      "Completed",
      "Cancelled",
      "Midway",
      "Arrived",
    ],
    default: "Pending",
  },
  estimatedPrice: Number,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Booking", bookingSchema);
