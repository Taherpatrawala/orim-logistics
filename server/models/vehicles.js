import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["UberX", "UberXL", "Black", "Comfort", "Black SUV"],
  },
  licensePlate: { type: String, unique: true },
  capacity: Number,
  model: String,
  color: String,
});

export default mongoose.model("Vehicle", vehicleSchema);
