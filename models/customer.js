import mongoose from 'mongoose';

// สร้าง schema สำหรับ collection customer
const customerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  company: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  checkedIn: { type: Boolean, default: false },
  activity1: { type: Boolean, default: false },  // เปลี่ยนจาก String เป็น Boolean
  activity2: { type: Boolean, default: false },  // เปลี่ยนจาก String เป็น Boolean
  timestamp_checkin: { type: Date, default: null }, // timestamp สำหรับ check-in
  timestamp_activity1: { type: Date, default: null }, // timestamp สำหรับ activity1
  timestamp_activity2: { type: Date, default: null }, // timestamp สำหรับ activity2
});

// เชื่อมต่อกับ collection "customer" ในฐานข้อมูลที่ชื่อ "4APR"
const Customer = mongoose.models.Customer || mongoose.model("Customer", customerSchema);

export default Customer;
