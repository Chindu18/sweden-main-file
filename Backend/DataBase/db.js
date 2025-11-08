import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()
const database_connection = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING)
      .then(() => console.log("✅ MongoDB Connected"))
      .catch((err) => console.error("❌ MongoDB connection error:", err));
  } catch (err) {
    console.error("DB connection error:", err);
  }
};

export default database_connection;
