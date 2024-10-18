import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const db_url = process.env.MONGO_SECRET_URI;

mongoose.set("strictQuery", false);
const connectDB = async () => {
  try {
    await mongoose.connect(db_url);
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
