import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    enrollment_number: { type: String, required: true, unique: true },
     g12_exam_id: { type: String, required: true, unique: true },
    nrc: { type: String, required: true , unique: true },
    date_of_birth: { type: Date, required: true },
    full_name: { type: String, required: true },
    password: { type: String }, // HASHED
  program: { type: String },
  admission_year: { type: String },
  current_year: { type: Number, default: 1 }, // 1 = Fresher
  status: { type: String, enum: ["REGISTERED", "BLOCKED"], default: "REGISTERED" }
}, { timestamps: true });

export const Students = mongoose.model("Students", studentSchema);
