import mongoose from "mongoose";

const bankDetailsSchema = new mongoose.Schema({
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },
  name: String,
  accountNumber: Number,
  ifsc: String,
});

export default mongoose.model("BankDetails", bankDetailsSchema);
