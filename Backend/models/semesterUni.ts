import mongoose from "mongoose";

const SemesterSchema = new mongoose.Schema({
  name: { type: String, required: true },          // e.g. "First Year - Semester 1"
  academicYear: { type: String, required: true },  // e.g. "2025-2026"
  isActive: { type: Boolean, default: true },       // Is this the globally current semester?
  
  
  isRegistrationOpen: { type: Boolean, default: false },
  isPaymentOpen: { type: Boolean, default: false },
  
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
}, { timestamps: true });

export default mongoose.model("Semester", SemesterSchema);