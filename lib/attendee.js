// lib/attendee.js
import mongoose from "mongoose";

export const connectMongDB = async () => {
  if (mongoose.connections[0].readyState) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI); // เชื่อมต่อฐานข้อมูล MongoDB
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
};
