import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  collectorType: { type: String, required: true }, // ✅ no enum (accepts anything)
  access: { type: String, default: "denied" },
});

export default mongoose.model("auth", authSchema);
