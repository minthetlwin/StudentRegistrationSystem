import mongoose from "mongoose";

const admittedStudentSchema = new mongoose.Schema({
  nrc: { type: String, required: true, unique: true },
  g12_exam_id: { type: String, required: true , unique: true },
  enrollment_number: { type: String, required: true, unique: true },
  full_name: { type: String, required: true },
  date_of_birth: { type: Date, required: true },
  program: { type: String, required: true },
  admission_year: { type: String, required: true },
  password: { type: String },
  role: { type: String, enum: ["student"],default: "student"},
  status: { type: String, enum: ["PENDING", "REGISTERED"], default: "PENDING" }
}, { timestamps: true });

export const AdmittedStudents = mongoose.model("AdmittedStudents", admittedStudentSchema);


//this model only use for checking admitted students 