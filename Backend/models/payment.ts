import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Students",
    required: true,
  },
  semester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Semester",
  },
  amountRequired: {
    type: Number,
    required: true,
    default: 500000, // Default 500k MMK
  },
  amountPaid: {
    type: Number,
    default: 0,
  },
  slip_image_url: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED"],
    default: "PENDING",
  },
  adminRemark: {
    type: String,
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AdminUser",
  },
  reviewedAt: Date,
  version: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export default mongoose.model("Payment", PaymentSchema);
