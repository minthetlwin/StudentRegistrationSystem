import mongoose from "mongoose";

const DormRegistrationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Students",
    required: true,
  },

  semester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Semester",
    required: true,
  },

  address: {
    type: String,
    required: true,
  },

  emergencyContact: {
    type: String,
    required: true,
  },

  reason: {
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
    ref: "Admin",
  },

  reviewedAt: Date,

  //future property for handling
 payment: {
  required: { type: Boolean, default: false },
  paid: { type: Boolean, default: false },
  paidAt: { type: Date },
},


}, { timestamps: true });

export default  mongoose.model("DormRegistration", DormRegistrationSchema);

