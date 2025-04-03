// models/attendee.js
import mongoose from "mongoose";

const AttendeeSchema = new mongoose.Schema({
  name: String,
  lastName: String,
  phone: String,
  checkedIn: Boolean,
  activity1: Boolean, // true = เข้าร่วม, false = ไม่เข้าร่วม
  activity2: Boolean, // true = เข้าร่วม, false = ไม่เข้าร่วม
});

export default mongoose.models.Attendee || mongoose.model("Attendee", AttendeeSchema);
