// lib/mongodb.js
import mongoose from 'mongoose';

const connectMongDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      return; // ถ้าเชื่อมต่อแล้วไม่ต้องเชื่อมต่อซ้ำ
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error", error);
  }
};

export { connectMongDB };
