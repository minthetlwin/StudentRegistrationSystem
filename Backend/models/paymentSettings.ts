import mongoose from "mongoose";

const PaymentSettingsSchema = new mongoose.Schema({
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
