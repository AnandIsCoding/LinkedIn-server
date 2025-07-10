import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  fullName: { type: String, required: true },
  password: { type: String, required: true }, // Hashed password
  createdAt: { type: Date, default: Date.now, expires: 300 }, // 5 min expiry
});

export default mongoose.model("Otp", otpSchema);
