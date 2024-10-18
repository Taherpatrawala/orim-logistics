import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  address: String,
  userType: {
    type: String,
    default: "customer",
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
