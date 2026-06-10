import mongoose from "mongoose";

const PaymentSettingsSchema = new mongoose.Schema({
  semester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Semester",
    required: true,
    unique: true // Ensures there is exactly ONE configuration structure per semester
  },
  feeBreakdown: [{
    description: String,
    amount: Number
  }],
  totalAmountRequired: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export default mongoose.model("PaymentSettings", PaymentSettingsSchema);
