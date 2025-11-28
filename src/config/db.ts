import mongoose from "mongoose";
import { config } from "./config";

export async function connectDB() {
  const uri = config.databaseUrl;
  mongoose.set("strictQuery", true);
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error", err);
    process.exit(1);
  }
}
