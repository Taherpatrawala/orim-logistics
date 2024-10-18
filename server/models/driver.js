import mongoose from "mongoose";

const driverSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  vehicleType: {
    type: String,
    enum: ["UberX", "UberXL", "Black", "Comfort", "Black SUV"],
  },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], index: "2dsphere" },
  },
  available: { type: Boolean, default: true },
  userType: {
    type: String,
    default: "driver",
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Driver", driverSchema);
