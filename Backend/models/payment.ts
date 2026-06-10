import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Students",
    required: true,
  },
  semester: { 
  type: mongoose.Schema.Types.ObjectId, 
  ref: 'Semester', 
  required: true 
},
  amountRequired: {
    type: Number,
    required: true,
    default: 0, 
  },
  feeBreakdown: [{
    description: String,
    amount: Number
  }],
  amountPaid: {
    type: Number,
    default: 0,
  },
  slip_image_url: {
    type: String,
  },
  status: {
    type: String,
    enum: ["UNPAID", "PENDING", "APPROVED", "REJECTED"],
    default: "UNPAID",
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
