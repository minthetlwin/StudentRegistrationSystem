import mongoose from "mongoose";


const SemesterSchema = new mongoose.Schema({
  name: { type: String, required: true },   // e.g. "2024-2025 Semester 1"
  academicYear: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
}, { timestamps: true });

// Automatically deactivate if end date has passed
SemesterSchema.pre('save', function(next) {
  if (this.endDate < new Date()) {
    this.isActive = false;
  }
  next();
});

export default mongoose.model("Semester", SemesterSchema);
